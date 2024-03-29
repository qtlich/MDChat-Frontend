import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Injectable}                                                              from '@angular/core';
import {BehaviorSubject, Observable, throwError}                                 from 'rxjs';
import {catchError, filter, switchMap, take}                                     from 'rxjs/operators';
import {AuthDataService}                                                         from './auth/shared/auth.data.service';
import {AuthenticationResponseModel}                                             from './auth/shared/models/authentication.response.model';

@Injectable({
              providedIn: 'root'
            })
export class TokenInterceptor implements HttpInterceptor
{

  isTokenRefreshing = false;
  refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject(null);

  constructor(public authService: AuthDataService)
  {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler):
    Observable<HttpEvent<any>>
  {
    if (req.url.indexOf('refresh') !== -1 || req.url.indexOf('login') !== -1)
    {
      return next.handle(req);
    }
    const jwtToken = this.authService.getJwtToken();
    if (jwtToken)
    {
      return next.handle(this.addToken(req, jwtToken)).pipe(catchError(error =>
                                                                       {
                                                                         if (error instanceof HttpErrorResponse
                                                                             && ([0, 401.403].includes(error.status)))
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
                 .refreshToken()
                 .pipe(switchMap((refreshTokenResponse: AuthenticationResponseModel) =>
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
