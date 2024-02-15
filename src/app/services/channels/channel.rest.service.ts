import {HttpClient}                   from '@angular/common/http';
import {Injectable}                   from '@angular/core';
import {Observable}                   from 'rxjs';
import {CreateChannelDtoPayloadModel} from '../../channel/create-channel/models/create-channel-dto-payload-model';
import {CreateChannelDtoResultModel}  from '../../channel/create-channel/models/create-channel-dto-result-model';
import {ChannelResponseModel}         from '../../channel/models/channel.response.model';
import {SearchChannelsInputModel}     from '../../channel/models/search-channels-input-model';
import {SearchChannelsResultModel}    from '../../channel/models/search-channels-result-model';
import {BaseRestApi}                  from '../../common/core/base.rest.api';
import {AppConfigService}             from '../../common/services/app.config.service';
import {ChannelCudRequestModel}       from './models/channel.cud.request.model';
import {ChannelCudResponseModel}      from './models/channel.cud.response.model';

@Injectable({providedIn: 'root'})
export class ChannelRestService extends BaseRestApi
{
  constructor(httpClient: HttpClient,
              configService: AppConfigService)
  {
    super(httpClient, configService);
  }

  public getAllChannels(): Observable<ChannelResponseModel[]>
  {
    return this.get<ChannelResponseModel[]>(`/channel/all`);
  }

  public searchChannels(item: SearchChannelsInputModel): Observable<SearchChannelsResultModel[]>
  {
    return this.post<SearchChannelsInputModel, SearchChannelsResultModel[]>(`/channel/search`, item);
  }

  public getChannel(id: number): Observable<ChannelResponseModel>
  {
    return this.get<ChannelResponseModel>(`/channel/` + id);
  }

  public channelCUD(item: ChannelCudRequestModel): Observable<ChannelCudResponseModel[]>
  {
    return this.post<ChannelCudRequestModel, ChannelCudResponseModel[]>(`/channel/cud`, item);
  }

  public createChannel(channelModel: CreateChannelDtoPayloadModel): Observable<CreateChannelDtoResultModel>
  {
    return this.post<CreateChannelDtoPayloadModel, ChannelResponseModel>(`/channel/create`, channelModel);
  }
}
