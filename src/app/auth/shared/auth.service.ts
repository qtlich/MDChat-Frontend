import {EventEmitter, Injectable, Output}      from '@angular/core';
import {HttpClient}                            from '@angular/common/http';
import {Observable}                            from 'rxjs';
import {LocalStorageService}                   from 'ngx-webstorage';
import {LoginRequestPayload}                   from '../login/login-request.payload';
import {LoginResponse}                         from '../login/login-response.payload';
import {map, tap}                              from 'rxjs/operators';
import {HttpConfigService}                     from '../../services/http.config.service';
import {SignUpRequestInputModel}               from './models/signup.request.input.model';
import {isEmptyStringField, isNullOrUndefined} from '../../common/core.free.functions';
import {Router}                                from '@angular/router';
import {ChangeUserInfoRequestModel}            from './models/change.user.info.request.model';
import {ChangeUserInfoResponseModel}           from './models/change.user.info.response.model';
import {MessageService}                        from 'primeng/api';
import {UserInfoRequestModel}                  from '../../user/user-profile/models/user.info.request.model';
import {UserInfoResponseModel}                 from '../../user/user-profile/models/user.info.response.model';

@Injectable({
              providedIn: 'root'
            })
export class AuthService
{

  @Output() loggedIn: EventEmitter<boolean> = new EventEmitter();
  @Output() username: EventEmitter<string> = new EventEmitter();

  refreshTokenPayload = {
    refreshToken: this.getRefreshToken(),
    username:     this.getUserName()
  }

  constructor(private _httpClient: HttpClient,
              private _localStorage: LocalStorageService,
              private _httpConfigService: HttpConfigService,
              private _messageService: MessageService,
              private _router: Router)
  {
  }

  public getUserInfo(item: UserInfoRequestModel): Observable<Array<UserInfoResponseModel>>
  {
    return this._httpClient.post<Array<UserInfoResponseModel>>(`${this._httpConfigService.baseApiUrl}/auth/getusersinfo`, item);
  }

  public changeUserInfo(item: ChangeUserInfoRequestModel): Observable<ChangeUserInfoResponseModel[]>
  {
    return this._httpClient.post<ChangeUserInfoResponseModel[]>(`${this._httpConfigService.baseApiUrl}/auth/changeuserinfo`, item);
  }

  public signup(item: SignUpRequestInputModel): Observable<any>
  {
    return this._httpClient.post(`${this._httpConfigService.baseApiUrl}/auth/signup`, item, {responseType: 'text'});
  }

  public login(item: LoginRequestPayload): Observable<boolean>
  {
    return this._httpClient
               .post<LoginResponse>(`${this._httpConfigService.baseApiUrl}/auth/login`, item)
               .pipe(map((data: LoginResponse) =>
                         {
                           this._localStorage.store('authenticationToken', data.authenticationToken);
                           this._localStorage.store('username', data.username);
                           this._localStorage.store('userid', data.username);
                           this._localStorage.store('refreshToken', data.refreshToken);
                           this._localStorage.store('expiresAt', data.expiresAt);
                           this.loggedIn.emit(true);
                           this.username.emit(data.username);
                           return true;
                         },
                         error =>
                         {
                           this._messageService.add({severity: 'error', detail: `An error occurred during the login operation`});
                           return false;
                         }));
  }

  public getJwtToken(): any
  {
    return this._localStorage.retrieve('authenticationToken');
  }

  public refreshToken(): Observable<any>
  {
    return this._httpClient
               .post<LoginResponse>(`${this._httpConfigService.baseApiUrl}/auth/refresh/token`,
                                    this.refreshTokenPayload)
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
                             this._messageService.add({severity: 'error', detail: `Can't retrive response during the refresh token operation`});
                           }
                         },
                         error => this._messageService.add({severity: 'error', detail: `An error occurred during the refresh token operation`})));
  }

  public logout(): void
  {
    this._httpClient
        .post(`${this._httpConfigService.baseApiUrl}/auth/logout`,
              this.refreshTokenPayload, {responseType: 'text'})
        .subscribe(message =>
                   {
                     if (!isEmptyStringField(message))
                     {
                       this._messageService.add({severity: 'info', detail: message});
                       this._router.navigateByUrl('/')
                     }
                     else
                     {
                       this._messageService.add({severity: 'error', detail: `Can't retrieve logout state`});
                     }
                     this.__clearStorage();
                   }, error =>
                   {
                     this._messageService.add({severity: 'error', detail: `An error occurred during the logout operation`});
                     this.__clearStorage();
                   })

  }

  private __clearStorage(): void
  {
    this._localStorage.clear('authenticationToken');
    this._localStorage.clear('username');
    this._localStorage.clear('userid');
    this._localStorage.clear('refreshToken');
    this._localStorage.clear('expiresAt');
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
}
