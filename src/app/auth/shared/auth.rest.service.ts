import {HttpClient}                  from '@angular/common/http';
import {Injectable}                  from '@angular/core';
import {Observable}                  from 'rxjs';
import {BaseRestApi}                 from '../../common/core/base.rest.api';
import {OperationResult}             from '../../common/models/operation.result.model';
import {AppConfigService}            from '../../common/services/app.config.service';
import {UserInfoRequestModel}        from '../../user/user-profile/models/user.info.request.model';
import {UserInfoResponseModel}       from '../../user/user-profile/models/user.info.response.model';
import {LoginRequestPayload}         from '../login/login-request.payload';
import {TRefreshTokenPayload}        from './auth.data.service';
import {AuthenticationResponseModel} from './models/authentication.response.model';
import {ChangeUserInfoRequestModel}  from './models/change.user.info.request.model';
import {ChangeUserInfoResponseModel} from './models/change.user.info.response.model';
import {SignUpRequestInputModel}     from './models/signup.request.input.model';

@Injectable({providedIn: 'root'})
export class AuthRestService extends BaseRestApi
{
  constructor(httpClient: HttpClient,
              configService: AppConfigService)
  {
    super(httpClient, configService);
  }

  public getUserInfo(item: UserInfoRequestModel): Observable<UserInfoResponseModel[]>
  {
    return this.post<UserInfoRequestModel, UserInfoResponseModel[]>(`/auth/getusersinfo`, item);
  }

  public changeUserInfo(item: ChangeUserInfoRequestModel): Observable<ChangeUserInfoResponseModel[]>
  {
    return this.post<ChangeUserInfoRequestModel, ChangeUserInfoResponseModel[]>(`/auth/changeuserinfo`, item);
  }

  public signup(item: SignUpRequestInputModel): Observable<OperationResult[]>
  {
    return this.post<SignUpRequestInputModel, OperationResult[]>(`/auth/signup`, item);
  }

  public login(item: LoginRequestPayload): Observable<AuthenticationResponseModel>
  {
    return this.post<LoginRequestPayload, AuthenticationResponseModel>(`/auth/login`, item);
  }

  public refreshToken(token: TRefreshTokenPayload): Observable<AuthenticationResponseModel>
  {
    return this.post<TRefreshTokenPayload, AuthenticationResponseModel>(`/auth/refresh/token`, token);
  }

  public logout(token: TRefreshTokenPayload): Observable<string>
  {
    return this.post<TRefreshTokenPayload, string>(`/auth/logout`, token, {}, 'text');
  }

}
