import {Injectable}                                                        from '@angular/core';
import {Observable, Subject}                                               from 'rxjs';
import {SubjectSubscription}                                               from 'rxjs/internal-compatibility';
import {GetChannelDescriptionRequestModel}                                 from '../../channel/models/get.channel.description.request.model';
import {GetChannelDescriptionResponseModel}                                from '../../channel/models/get.channel.description.response.model';
import {SearchChannelsInputModel}                                          from '../../channel/models/search-channels-input-model';
import {SearchChannelsResultModel}                                                            from '../../channel/models/search-channels-result-model';
import {isAllOperationsSuccess, isEmptyArray, isNullOrUndefined, showOperationResultMessages} from '../../common/core/core.free.functions';
import {OPERATION_TYPES}                                                                      from '../../common/core/enums/operation.types';
import {EActionType}                                                       from '../../common/models/event.type';
import {BaseService}                                                       from '../../common/services/base.service';
import {GlobalBusService}                                                  from '../../common/services/global.bus.service';
import {ChannelRestService}                                                from './channel.rest.service';
import {ChangeUserChannelSubscriptionRequestModel}                         from './models/change.user.channel.subscription.request.model';
import {ChangeUserChannelSubscriptionResponseModel}                        from './models/change.user.channel.subscription.response.model';
import {ChannelCudRequestModel}                                            from './models/channel.cud.request.model';
import {ChannelCudResponseModel}                                           from './models/channel.cud.response.model';
import {GetChannelCountSubscribersRequestModel}                                               from './models/get.channel.count.subscribers.request.model';
import {GetChannelCountSubscribersResponseModel}                                              from './models/get.channel.count.subscribers.response.model';
import {GetChannelPostsUniversalRequestModel}                              from './models/get.channel.posts.universal.request.model';
import {GetChannelPostsUniversalResponseModel}                             from './models/get.channel.posts.universal.response.model';
import {GetUserChannelSubscriptionRequestModel}                            from './models/get.user.channel.subscription.request.model';
import {GetUserChannelSubscriptionResponseModel}                           from './models/get.user.channel.subscription.response.model';

export type OnSuccessModifyChannelItem = {
  success?: boolean,
  item?: ChannelCudRequestModel
}
export type OnChangeUserChannelSubscriptionResult = {
  success: boolean,
  item: ChangeUserChannelSubscriptionRequestModel,
  result: ChangeUserChannelSubscriptionResponseModel[]
}

@Injectable({providedIn: 'root'})
export class ChannelDataService extends BaseService
{
  private readonly _onLoadChannelDescriptionSubject: Subject<GetChannelDescriptionResponseModel> = new Subject<GetChannelDescriptionResponseModel>();
  private readonly _onSearchChannelsSubject: Subject<SearchChannelsResultModel[]> = new Subject<SearchChannelsResultModel[]>();
  private readonly _onLoadChannelPostsSubject: Subject<GetChannelPostsUniversalResponseModel[]> = new Subject<GetChannelPostsUniversalResponseModel[]>();
  private readonly _onLoadUserChannelSubscriptionSubject:Subject<GetUserChannelSubscriptionResponseModel> = new Subject<GetUserChannelSubscriptionResponseModel>();
  private readonly _onLoadChannelCountSubscribersSubject:Subject<GetChannelCountSubscribersResponseModel> = new Subject<GetChannelCountSubscribersResponseModel>();
  constructor(private _restService: ChannelRestService,
              serviceBus: GlobalBusService)
  {
    super(serviceBus);
  }
  public onLoadUserChannelSubscriptionEvent():Observable<GetUserChannelSubscriptionResponseModel>
  {
    return this._onLoadUserChannelSubscriptionSubject;
  }
  public onLoadChannelSubscribersEvent():Observable<GetChannelCountSubscribersResponseModel>
  {
    return this._onLoadChannelCountSubscribersSubject;
  }
  public onLoadChannelPostsUniversalEvent(): Observable<GetChannelPostsUniversalResponseModel[]>
  {
    return this._onLoadChannelPostsSubject;
  }

  public onSearchChannelsEvent(): Observable<SearchChannelsResultModel[]>
  {
    return this._onSearchChannelsSubject;
  }

  public onLoadChannelDescriptionEvent(): Observable<GetChannelDescriptionResponseModel>
  {
    return this._onLoadChannelDescriptionSubject;
  }

  public getAllChannels(): Observable<GetChannelDescriptionResponseModel[]>
  {
    return this._restService.getAllChannels();
  }

  public searchChannels(item: SearchChannelsInputModel): void
  {
    this.toDb(item,
              input => this._restService.searchChannels(input),
              (data: SearchChannelsResultModel[]) =>
              {
                this._onSearchChannelsSubject.next(!isEmptyArray(data) ? data : []);
              },
              `Can't search channels`);
  }

  public getChannelDescription(item: GetChannelDescriptionRequestModel): void
  {
    this.toDb(item,
              input => this._restService.getChannelDescription(input),
              (data: GetChannelDescriptionResponseModel) =>
              {
                this._onLoadChannelDescriptionSubject.next(data);
              },
              `Can't load channel description`);
  }

  public getChannelPostsUniversal(item: GetChannelPostsUniversalRequestModel): void
  {
    this.toDb(item,
              input => this._restService.getChannelPostsUniversal(input),
              (data: GetChannelPostsUniversalResponseModel[]) =>
              {
                this._onLoadChannelPostsSubject.next(!isEmptyArray(data) ? data : []);
              },
              `Can't load channel posts`);
  }

  public channelCUD(item: ChannelCudRequestModel): void
  {
    this.toDb(item,
              input => this._restService.channelCUD(input),
              (data: ChannelCudResponseModel[]) =>
              {
                showOperationResultMessages(this.serviceBus, data);
                if(isAllOperationsSuccess(data) && item.operationType == OPERATION_TYPES.CREATE)
                {
                  item.channelId = data[0].id;
                }
                this.serviceBus.sendEvent<OnSuccessModifyChannelItem>(EActionType.SUCCESS_MODIFY_CHANNEL, {success: isAllOperationsSuccess(data), item: item});
              },
              `Can't modify channel`);
  }

  public changeChannelSubscription(item: ChangeUserChannelSubscriptionRequestModel): void
  {
    this.toDb(item,
              input => this._restService.changeUserChannelSubscription(input),
              (data: ChangeUserChannelSubscriptionResponseModel[]) =>
              {
                showOperationResultMessages(this.serviceBus, data);
                this.serviceBus.sendEvent<OnChangeUserChannelSubscriptionResult>(EActionType.ON_CHANGE_CHANNEL_SUBSCRIPTION_ACTION, {success: isAllOperationsSuccess(data), item: item, result: data});
              },
              `Can't change channel subscription`);
  }
  public getChannelSubscription(item: GetUserChannelSubscriptionRequestModel): void
  {
    this.toDb(item,
              input => this._restService.getUserChannelSubscription(input),
              (data: GetUserChannelSubscriptionResponseModel) =>
              {
                this._onLoadUserChannelSubscriptionSubject.next(!isNullOrUndefined(data)?data: new GetUserChannelSubscriptionResponseModel(null,item.channelId,false));
              },
              `Can't get channel subscription`);
  }
  public getChannelCountSubscribers(item: GetChannelCountSubscribersRequestModel): void
  {
    this.toDb(item,
              input => this._restService.getChannelCountSubscribers(input),
              (data: GetChannelCountSubscribersResponseModel) =>
              {
                this._onLoadUserChannelSubscriptionSubject.next(!isNullOrUndefined(data)?data: new GetUserChannelSubscriptionResponseModel(null,item.channelId,false));
              },
              `Can't get channel subscription`);
  }
}
