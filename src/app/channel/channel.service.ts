import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ChannelResponseModel} from './models/channel.response.model';
import {Observable} from 'rxjs';
import {CreateChannelDtoPayloadModel} from "./create-channel/models/create-channel-dto-payload-model";
import {CreateChannelDtoResultModel} from "./create-channel/models/create-channel-dto-result-model";
import {HttpConfigService} from "../services/http.config.service";
import {SearchChannelsInputModel} from "./models/search-channels-input-model";
import {SearchChannelsResultModel} from "./models/search-channels-result-model";

@Injectable({
              providedIn: 'root'
            })
export class ChannelService
{
  constructor(private http: HttpClient,
              private httpConfigService: HttpConfigService)
  {
  }

  public getAllChannels(): Observable<Array<ChannelResponseModel>>
  {
    return this.http.get<Array<ChannelResponseModel>>(`${this.httpConfigService.baseApiUrl}/channel/all`);
  }
  public searchChannels(item:SearchChannelsInputModel):Observable<Array<SearchChannelsResultModel>>
  {
    return this.http.post<Array<SearchChannelsResultModel>>(`${this.httpConfigService.baseApiUrl}/channel/search`,item);
  }
  public getChannel(id: number): Observable<ChannelResponseModel>
  {
    return this.http.get<ChannelResponseModel>(`${this.httpConfigService.baseApiUrl}/channel/` + id);
  }

  public createChannel(channelModel: CreateChannelDtoPayloadModel): Observable<CreateChannelDtoResultModel>
  {
    return this.http.post<ChannelResponseModel>(`${this.httpConfigService.baseApiUrl}/channel/create`, channelModel);
  }

}
