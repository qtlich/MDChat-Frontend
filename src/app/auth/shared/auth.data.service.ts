import {Injectable}                                         from '@angular/core';
import {Router}                                             from '@angular/router';
import {LocalStorageService}                                from 'ngx-webstorage';
import {Observable, ReplaySubject}                          from 'rxjs';
import {map, tap}                                           from 'rxjs/operators';
import {errorToText, isEmptyStringField, isNullOrUndefined} from '../../common/core/core.free.functions';
import {EActionType}                                        from '../../common/models/event.type';
import {OperationResult}                                    from '../../common/models/operation.result.model';
import {BaseService}                                        from '../../common/services/base.service';
import {GlobalBusService}                                   from '../../common/services/global.bus.service';
import {UserInfoRequestModel}                               from '../../user/user-profile/models/user.info.request.model';
import {UserInfoResponseModel}                              from '../../user/user-profile/models/user.info.response.model';
import {LoginRequestPayload}                                from '../login/login-request.payload';
import {LoginResponse}                                      from '../login/login-response.payload';
import {AuthRestService}                                    from './auth.rest.service';
import {AuthenticationResponseModel}                        from './models/authentication.response.model';
import {ChangeUserInfoRequestModel}                         from './models/change.user.info.request.model';
import {ChangeUserInfoResponseModel}                        from './models/change.user.info.response.model';
import {SignUpRequestInputModel}                            from './models/signup.request.input.model';

export type TRefreshTokenPayload = { refreshToken: string, username: string };

@Injectable({providedIn: 'root'})
export class AuthDataService extends BaseService
{

  public loggedIn: ReplaySubject<boolean> = new ReplaySubject<boolean>(1);
  public userName: ReplaySubject<string> = new ReplaySubject<string>(1);

  constructor(private _localStorage: LocalStorageService,
              private _router: Router,
              private _restService: AuthRestService,
              serviceBus: GlobalBusService)
  {
    super(serviceBus);
    this.__init();
  }

  private __init(): void
  {
    this.loggedIn.next(this.isLoggedIn());
    this.userName.next(this.getUserName());
  }

  public getUserInfo(item: UserInfoRequestModel): Observable<UserInfoResponseModel[]>
  {
    return this._restService.getUserInfo(item);
  }

  public changeUserInfo(item: ChangeUserInfoRequestModel): Observable<ChangeUserInfoResponseModel[]>
  {
    return this._restService.changeUserInfo(item);
  }

  public signup(item: SignUpRequestInputModel): Observable<OperationResult[]>
  {
    return this._restService.signup(item);
  }

  public login(item: LoginRequestPayload): Observable<boolean>
  {
    return this._restService
               .login(item)
               .pipe(map((data: AuthenticationResponseModel) =>
                         {
                           this._localStorage.store('authenticationToken', data.authenticationToken);
                           this._localStorage.store('username', data.username);
                           this._localStorage.store('userid', data.userid);
                           this._localStorage.store('refreshToken', data.refreshToken);
                           this._localStorage.store('expiresAt', data.expiresAt);
                           this.loggedIn.next(true);
                           this.userName.next(data.username);
                           this.serviceBus.sendEvent(EActionType.ON_LOGIN_ACTION, true);
                           return true;
                         },
                         error =>
                         {
                           this.serviceBus.showError(errorToText(error));
                           this.serviceBus.showError(`An error occurred during the login operation`);
                           return false;
                         }));
  }

  public getJwtToken(): any
  {
    return this._localStorage.retrieve('authenticationToken');
  }

  public refreshToken(): Observable<any>
  {
    return this._restService
               .refreshToken({refreshToken: this.getRefreshToken(), username: this.getUserName()})
               .pipe(tap((response: LoginResponse) =>
                         {
                           this._localStorage.clear('authenticationToken');
                           this._localStorage.clear('expiresAt');
                           if (!isNullOrUndefined(response))
                           {
                             this._localStorage.store('authenticationToken', response.authenticationToken);
                             this._localStorage.store('expiresAt', response.expiresAt);
                           }
                           else
                           {
                             this.serviceBus.showError(`Can't retrive response during the refresh token operation`);
                           }
                         },
                         error => this.serviceBus.showError(`An error occurred during the refresh token operation`)));
  }

  public logout(): void
  {
    this._restService
        .logout({refreshToken: this.getRefreshToken(), username: this.getUserName()})
        .subscribe(message =>
                   {
                     if (!isEmptyStringField(message))
                     {
                       this.serviceBus.showInfo(message);
                       this._router.navigateByUrl('/');
                       this.loggedIn.next(false);
                       this.userName.next(null);
                       this.__clearStorage();
                       this.serviceBus.sendEvent(EActionType.ON_LOGOUT_ACTION, true);
                     }
                     else
                     {
                       this.serviceBus.showError(`Can't retrieve logout state`);
                     }
                     this.__clearStorage();
                   }, error =>
                   {
                     this.serviceBus.showError(`An error occurred during the logout operation`);
                     this.__clearStorage();
                   })

  }

  public getUserName(): string
  {
    return this._localStorage.retrieve('username');
  }

  public getUserId(): string
  {
    return this._localStorage.retrieve('userid');
  }

  public getRefreshToken(): any
  {
    return this._localStorage.retrieve('refreshToken');
  }

  public isLoggedIn(): boolean
  {
    return this.getJwtToken() != null;
  }

  private __clearStorage(): void
  {
    this._localStorage.clear('authenticationToken');
    this._localStorage.clear('username');
    this._localStorage.clear('userid');
    this._localStorage.clear('refreshToken');
    this._localStorage.clear('expiresAt');
  }
}
