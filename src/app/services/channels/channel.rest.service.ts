import {HttpClient}                                 from '@angular/common/http';
import {Injectable}                                 from '@angular/core';
import {Observable}                                 from 'rxjs';
import {GetChannelDescriptionRequestModel}          from '../../channel/models/get.channel.description.request.model';
import {GetChannelDescriptionResponseModel}         from '../../channel/models/get.channel.description.response.model';
import {SearchChannelsInputModel}                   from '../../channel/models/search-channels-input-model';
import {SearchChannelsResultModel}                  from '../../channel/models/search-channels-result-model';
import {BaseRestApi}                                from '../../common/core/base.rest.api';
import {AppConfigService}                           from '../../common/services/app.config.service';
import {ChangeUserChannelSubscriptionRequestModel}  from './models/change.user.channel.subscription.request.model';
import {ChangeUserChannelSubscriptionResponseModel} from './models/change.user.channel.subscription.response.model';
import {ChannelCudRequestModel}                     from './models/channel.cud.request.model';
import {ChannelCudResponseModel}                    from './models/channel.cud.response.model';
import {GetChannelCountSubscribersRequestModel}     from './models/get.channel.count.subscribers.request.model';
import {GetChannelCountSubscribersResponseModel}    from './models/get.channel.count.subscribers.response.model';
import {GetChannelPostsUniversalRequestModel}       from './models/get.channel.posts.universal.request.model';
import {GetChannelPostsUniversalResponseModel}      from './models/get.channel.posts.universal.response.model';
import {GetUserChannelSubscriptionRequestModel}     from './models/get.user.channel.subscription.request.model';
import {GetUserChannelSubscriptionResponseModel}    from './models/get.user.channel.subscription.response.model';

@Injectable({providedIn: 'root'})
export class ChannelRestService extends BaseRestApi
{
  constructor(httpClient: HttpClient,
              configService: AppConfigService)
  {
    super(httpClient, configService);
  }

  public getAllChannels(): Observable<GetChannelDescriptionResponseModel[]>
  {
    return this.get<GetChannelDescriptionResponseModel[]>(`/channel/all`);
  }

  public searchChannels(item: SearchChannelsInputModel): Observable<SearchChannelsResultModel[]>
  {
    return this.post<SearchChannelsInputModel, SearchChannelsResultModel[]>(`/channel/search`, item);
  }

  public getChannelDescription(item: GetChannelDescriptionRequestModel): Observable<GetChannelDescriptionResponseModel>
  {
    return this.post<GetChannelDescriptionRequestModel, GetChannelDescriptionResponseModel>(`/channel/get-description`, item);
  }

  public channelCUD(item: ChannelCudRequestModel): Observable<ChannelCudResponseModel[]>
  {
    return this.post<ChannelCudRequestModel, ChannelCudResponseModel[]>(`/channel/cud`, item);
  }

  public getChannelPostsUniversal(item: GetChannelPostsUniversalRequestModel): Observable<GetChannelPostsUniversalResponseModel[]>
  {
    return this.post<GetChannelPostsUniversalRequestModel, GetChannelPostsUniversalResponseModel[]>(`/channel/universal-channel-posts`, item);
  }

  public changeUserChannelSubscription(item: ChangeUserChannelSubscriptionRequestModel): Observable<ChangeUserChannelSubscriptionResponseModel[]>
  {
    return this.post<ChangeUserChannelSubscriptionRequestModel, ChangeUserChannelSubscriptionResponseModel[]>(`/channel/change-subscription`, item);
  }

  public getUserChannelSubscription(item: GetUserChannelSubscriptionRequestModel): Observable<GetUserChannelSubscriptionResponseModel>
  {
    return this.post<GetUserChannelSubscriptionRequestModel, GetUserChannelSubscriptionResponseModel>(`/channel/get-subscription`, item);
  }

  public getChannelCountSubscribers(item: GetChannelCountSubscribersRequestModel): Observable<GetChannelCountSubscribersResponseModel>
  {
    return this.post<GetChannelCountSubscribersRequestModel, GetChannelCountSubscribersResponseModel>(`/channel/get-count-subscribers`, item);
  }
}
