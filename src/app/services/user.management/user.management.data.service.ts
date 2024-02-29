import {Injectable}                                                                           from '@angular/core';
import {SelectItem}                                                                           from 'primeng-lts';
import {Observable, ReplaySubject, Subject}                                                   from 'rxjs';
import {isAllOperationsSuccess, isEmptyArray, isNullOrUndefined, showOperationResultMessages} from '../../common/core/core.free.functions';
import {MessageType}                                                                          from '../../common/core/message.type';
import {EActionType}                                                                          from '../../common/models/event.type';
import {BaseService}                                                                          from '../../common/services/base.service';
import {GlobalBusService}                                                                     from '../../common/services/global.bus.service';
import {GetChannelBannedUsersRequestModel}                                                    from './models/get.channel.banned.users.request.model';
import {GetChannelBannedUsersResponseModel}                                                   from './models/get.channel.banned.users.response.model';
import {GetChannelModeratorUsersRequestModel}                                                 from './models/get.channel.moderator.users.request.model';
import {GetChannelModeratorUsersResponseModel}                                                from './models/get.channel.moderator.users.response.model';
import {GetIsUserBannedInChannelRequestModel}                                                 from './models/get.is.user.banned.in.channel.request.model';
import {GetIsUserBannedInChannelResponseModel}    from './models/get.is.user.banned.in.channel.response.model';
import {GetIsUserModeratorInChannelRequestModel}                                              from './models/get.is.user.moderator.in.channel.request.model';
import {GetIsUserModeratorInChannelResponseModel}                                             from './models/get.is.user.moderator.in.channel.response.model';
import {ManageUserChannelPermissionsRequestModel} from './models/manage.user.channel.permissions.request.model';
import {ManageUserChannelBanningRequestModel}     from './models/manage.user.channel.banning.request.model';
import {ManageUserChannelBanningResponseModel}                                                from './models/manage.user.channel.banning.response.model';
import {SearchUsersRequestModel}                                                              from './models/search.users.request.model';
import {SearchUsersResponseModel}                                                             from './models/search.users.response.model';
import {UserManagementRestService}                                                            from './user.management.rest.service';

export type OnManageUserChannelBanningResult =
  {
    success: boolean,
    input: ManageUserChannelBanningRequestModel,
    result: ManageUserChannelBanningResponseModel[]
  }
export type OnManageUserChannelModeratorResult =
  {
    success: boolean,
    input: ManageUserChannelBanningRequestModel,
    result: ManageUserChannelBanningResponseModel[]
  }

@Injectable({providedIn: 'root'})
export class UserManagementDataService extends BaseService
{
  private readonly _onLoadBanReasonsSISubject: ReplaySubject<SelectItem[]> = new ReplaySubject<SelectItem[]>(1);
  private readonly _onSearchUsersSubject: Subject<SearchUsersResponseModel[]> = new Subject<SearchUsersResponseModel[]>();
  private readonly _onLoadChannelBannedUsersSubject: Subject<GetChannelBannedUsersResponseModel[]> = new Subject<GetChannelBannedUsersResponseModel[]>();
  private readonly _onLoadChannelModeratorUsersSubject: Subject<GetChannelModeratorUsersResponseModel[]> = new Subject<GetChannelModeratorUsersResponseModel[]>();
  private readonly _onManageUserBanningStateSubject: Subject<OnManageUserChannelBanningResult> = new Subject<OnManageUserChannelBanningResult>();
  private readonly _onLoadIsUserBannedInChannel: Subject<GetIsUserBannedInChannelResponseModel> = new Subject<GetIsUserBannedInChannelResponseModel>();
  private readonly _onLoadIsUserModeratorInChannel: Subject<GetIsUserModeratorInChannelResponseModel> = new Subject<GetIsUserModeratorInChannelResponseModel>();

  constructor(private _restService: UserManagementRestService,
              serviceBus: GlobalBusService)
  {
    super(serviceBus);
    this.__loadDirectories();
  }

  public onManageUserBanningEvent(): Observable<OnManageUserChannelBanningResult>
  {
    return this._onManageUserBanningStateSubject;
  }

  public onLoadBanReasonsSIEvent(): Observable<SelectItem[]>
  {
    return this._onLoadBanReasonsSISubject;
  }

  public onLoadIsUserBannedInChannelEvent(): Observable<GetIsUserBannedInChannelResponseModel>
  {
    return this._onLoadIsUserBannedInChannel;
  }
  public onLoadIsUserModeratorInChannelEvent(): Observable<GetIsUserModeratorInChannelResponseModel>
  {
    return this._onLoadIsUserModeratorInChannel;
  }

  public onLoadChannelBannedUsersEvent(): Observable<GetChannelBannedUsersResponseModel[]>
  {
    return this._onLoadChannelBannedUsersSubject;
  }

  public onLoadChannelModeratorUsersEvent(): Observable<GetChannelModeratorUsersResponseModel[]>
  {
    return this._onLoadChannelModeratorUsersSubject;
  }

  public manageUserChannelBanning(item: ManageUserChannelBanningRequestModel): void
  {
    this.toDb(item,
              input => this._restService.manageUserChannelBanning(input),
              data =>
              {
                showOperationResultMessages(this.serviceBus, data);
                const value: OnManageUserChannelBanningResult = {success: isAllOperationsSuccess(data), input: item, result: !isEmptyArray(data) ? data : []}
                this.serviceBus.sendEvent<OnManageUserChannelBanningResult>(EActionType.ON_BAN_USER_IN_CHANNEL_ACTION, value);
                this._onManageUserBanningStateSubject.next(value);
              },
              `Can't manage user ban state`)
  }
  public manageUserChannelPermissions(item: ManageUserChannelPermissionsRequestModel): void
  {
    this.toDb(item,
              input => this._restService.manageChannelUserPermissions(input),
              data =>
              {
                showOperationResultMessages(this.serviceBus, data);
                const value: OnManageUserChannelBanningResult = {success: isAllOperationsSuccess(data), input: item, result: !isEmptyArray(data) ? data : []}
                this.serviceBus.sendEvent<OnManageUserChannelBanningResult>(EActionType.ON_ADD_MODERATOR_USER_IN_CHANNEL_ACTION, value);
                this._onManageUserBanningStateSubject.next(value);
              },
              `Can't manage user ban state`)
  }

  public checkIsUserBannedInChannel(item: GetIsUserBannedInChannelRequestModel): void
  {
    this.toDb(item,
              input => this._restService.getIsUserBannedInChannel(input),
              result =>
              {
                if(!isNullOrUndefined(result) && result.isBanned)
                {
                  this.showMessage(MessageType.WARNING, `User is already banned`);
                }
                this._onLoadIsUserBannedInChannel.next(!isNullOrUndefined(result) ? result : new GetIsUserBannedInChannelResponseModel(result.userId, result.channelId, true));
              },
              `Can't load user channel ban state`);
  }
  public checkIsUserModeratorInChannel(item: GetIsUserModeratorInChannelRequestModel): void
  {
    this.toDb(item,
              input => this._restService.getIsUserModeratorInChannel(input),
              result =>
              {
                if(!isNullOrUndefined(result) && result.isModerator)
                {
                  this.showMessage(MessageType.WARNING, `User is already a channel moderator`);
                }
                this._onLoadIsUserBannedInChannel.next(!isNullOrUndefined(result) ? result : new GetIsUserBannedInChannelResponseModel(result.userId, result.channelId, true));
              },
              `Can't load user channel ban state`);
  }

  public onSearchUsersEvent(): Observable<SearchUsersResponseModel[]>
  {
    return this._onSearchUsersSubject;
  }

  public searchUsers(item: SearchUsersRequestModel): void
  {
    this.toDb(item,
              input => this._restService.searchUsers(input),
              data => this._onSearchUsersSubject.next(!isEmptyArray(data) ? data : []),
              `Can't search users`);
  }

  public loadChannelBannedUsers(item: GetChannelBannedUsersRequestModel): void
  {
    this.toDb(item,
              input => this._restService.getChannelBannedUsers(input),
              data => this._onLoadChannelBannedUsersSubject.next(!isEmptyArray(data) ? data : []),
              `Can't load channel banned users`);
  }

  public loadChannelModeratorUsers(item: GetChannelModeratorUsersRequestModel): void
  {
    this.toDb(item,
              input => this._restService.getChannelModeratorUsers(input),
              data => this._onLoadChannelModeratorUsersSubject.next(!isEmptyArray(data) ? data : []),
              `Can't load channel moderator users`);
  }

  private __loadDirectories(): void
  {
    this.__loadBanReasons();
  }

  private __loadBanReasons(): void
  {
    this.toDb(null,
              input => this._restService.getBanReasons(input),
              data => this._onLoadBanReasonsSISubject.next(!isEmptyArray(data) ? data.map(item => <SelectItem>{label: item.name, value: item.id}) : []),
              `Can't load ban reasons`);
  }
}
