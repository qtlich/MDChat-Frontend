import {Injectable}                                                              from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {BehaviorSubject, Observable, throwError}                                 from 'rxjs';
import {AuthService}                                                             from './auth/shared/auth.service';
import {catchError, filter, switchMap, take}                                     from 'rxjs/operators';
import {LoginResponse}                                                           from './auth/login/login-response.payload';

@Injectable({
              providedIn: 'root'
            })
export class TokenInterceptor implements HttpInterceptor
{

  isTokenRefreshing = false;
  refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject(null);

  constructor(public authService: AuthService)
  {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler):
    Observable<HttpEvent<any>>
  {
    console.log('req=>', req);
    if (req.url.indexOf('refresh') !== -1 || req.url.indexOf('login') !== -1)
    {
      return next.handle(req);
    }
    const jwtToken = this.authService.getJwtToken();
    if (jwtToken)
    {
      console.log('next', next);
      return next.handle(this.addToken(req, jwtToken)).pipe(catchError(error =>
                                                                       {
                                                                         console.error('error.status=>', error.status);
                                                                         console.error('error instanceof HttpErrorResponse', error instanceof HttpErrorResponse);
                                                                         if (error instanceof HttpErrorResponse
                                                                             && ([0,401.403].includes(error.status)))
                                                                         {
                                                                           return this.handleAuthErrors(req, next);
                                                                         }
                                                                         else
                                                                         {
                                                                           return throwError(error);
                                                                         }
                                                                       }));
    }
    return next.handle(req);

  }

  private handleAuthErrors(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>
  {

    console.info('handleAuthErrors req=>', req);
    console.info('handleAuthErrors next=>', next);
    console.info('this.isTokenRefreshing', this.isTokenRefreshing);
    if (!this.isTokenRefreshing)
    {
      this.isTokenRefreshing = true;
      this.refreshTokenSubject.next(null);

      return this.authService
                 .refreshToken().pipe(switchMap((refreshTokenResponse: LoginResponse) =>
                                                {
                                                  this.isTokenRefreshing = false;
                                                  this.refreshTokenSubject.next(refreshTokenResponse.authenticationToken);
                                                  return next.handle(this.addToken(req,
                                                                                   refreshTokenResponse.authenticationToken));
                                                })
        )
    }
    else
    {
      return this.refreshTokenSubject.pipe(filter(result => result !== null),
                                           take(1),
                                           switchMap((res) =>
                                                     {
                                                       return next.handle(this.addToken(req,
                                                                                        this.authService.getJwtToken()))
                                                     })
      );
    }
  }

  addToken(req: HttpRequest<any>, jwtToken: any)
  {
    return req.clone({
                       setHeaders: {'Authorization': `Bearer ${jwtToken}`, 'Access-Control-Allow-Origin': '*'}
                     });
  }

}
