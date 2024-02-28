import {HttpClient}               from '@angular/common/http';
import {Injectable}               from '@angular/core';
import {Observable}               from 'rxjs';
import {BaseRestApi}              from '../../common/core/base.rest.api';
import {AppConfigService}         from '../../common/services/app.config.service';
import {BanReasonResponseModel}   from './models/ban.reason.response.model';
import {GetChannelBannedUsersRequestModel} from './models/get.channel.banned.users.request.model';
import {GetChannelBannedUsersResponseModel} from './models/get.channel.banned.users.response.model';
import {GetChannelModeratorUsersRequestModel} from './models/get.channel.moderator.users.request.model';
import {GetChannelModeratorUsersResponseModel} from './models/get.channel.moderator.users.response.model';
import {GetIsUserBannedInChannelRequestModel} from './models/get.is.user.banned.in.channel.request.model';
import {GetIsUserBannedInChannelResponseModel} from './models/get.is.user.banned.in.channel.response.model';
import {ManageUserChannelBanningRequestModel} from './models/manage.user.channel.banning.request.model';
import {ManageUserChannelBanningResponseModel} from './models/manage.user.channel.banning.response.model';
import {SearchUsersRequestModel}  from './models/search.users.request.model';
import {SearchUsersResponseModel} from './models/search.users.response.model';

@Injectable({providedIn: 'root'})
export class UserManagementRestService extends BaseRestApi
{
  constructor(httpClient: HttpClient,
              configService: AppConfigService)
  {
    super(httpClient, configService);
  }

  public getBanReasons(item:any): Observable<BanReasonResponseModel[]>
  {
    return this.get(`/user-management/banreasons/get`);
  }

  public searchUsers(item: SearchUsersRequestModel): Observable<SearchUsersResponseModel[]>
  {
    return this.post(`/user-management/search-users`, item);
  }
  public getChannelBannedUsers(item: GetChannelBannedUsersRequestModel): Observable<GetChannelBannedUsersResponseModel[]>
  {
    return this.post(`/user-management/get-channel-banned-users`, item);
  }
  public getChannelModeratorUsers(item: GetChannelModeratorUsersRequestModel): Observable<GetChannelModeratorUsersResponseModel[]>
  {
    return this.post(`/user-management/get-channel-moderator-users`, item);
  }
  public manageUserChannelBanning(item: ManageUserChannelBanningRequestModel): Observable<ManageUserChannelBanningResponseModel[]>
  {
    return this.post(`/user-management/manage-user-channel-banning`, item);
  }
  public getIsUserBannedInChannel(item: GetIsUserBannedInChannelRequestModel): Observable<GetIsUserBannedInChannelResponseModel>
  {
    return this.post(`/user-management/is-user-banned`, item);
  }
}
