import {Injectable}                                          from '@angular/core';
import {Observable}                                          from 'rxjs';
import {CreateChannelDtoPayloadModel}                        from '../../channel/create-channel/models/create-channel-dto-payload-model';
import {CreateChannelDtoResultModel}                         from '../../channel/create-channel/models/create-channel-dto-result-model';
import {ChannelResponseModel}                                from '../../channel/models/channel.response.model';
import {SearchChannelsInputModel}                            from '../../channel/models/search-channels-input-model';
import {SearchChannelsResultModel}                           from '../../channel/models/search-channels-result-model';
import {isAllOperationsSuccess, showOperationResultMessages} from '../../common/core/core.free.functions';
import {OPERATION_TYPES}                                     from '../../common/core/enums/operation.types';
import {EActionType}                                         from '../../common/models/event.type';
import {BaseService}                                         from '../../common/services/base.service';
import {GlobalBusService}                                    from '../../common/services/global.bus.service';
import {ChannelRestService}                                  from './channel.rest.service';
import {ChannelCudRequestModel}                              from './models/channel.cud.request.model';
import {ChannelCudResponseModel}                             from './models/channel.cud.response.model';

export type OnSuccessModifyChannelItem = {
  success?: boolean,
  item?: ChannelCudRequestModel
}

@Injectable({providedIn: 'root'})
export class ChannelDataService extends BaseService
{
  constructor(private _restService: ChannelRestService,
              serviceBus: GlobalBusService)
  {
    super(serviceBus);
  }

  public getAllChannels(): Observable<ChannelResponseModel[]>
  {
    return this._restService.getAllChannels();
  }

  public searchChannels(item: SearchChannelsInputModel): Observable<SearchChannelsResultModel[]>
  {
    return this._restService.searchChannels(item);
  }

  public getChannel(id: number): Observable<ChannelResponseModel>
  {
    return this._restService.getChannel(id);
  }

  public channelCUD(item: ChannelCudRequestModel): void
  {
    this.toDb(item,
              input => this._restService.channelCUD(input),
              (data: ChannelCudResponseModel[]) =>
              {
                showOperationResultMessages(this.serviceBus, data);
                if (isAllOperationsSuccess(data) && item.operationType ==OPERATION_TYPES.CREATE)
                {
                  item.channelId = data[0].id;
                }
                this.serviceBus.sendEvent<OnSuccessModifyChannelItem>(EActionType.SUCCESS_MODIFY_CHANNEL, {success: isAllOperationsSuccess(data), item: item});
              },
              `Can't modify channel`);
  }

  public createChannel(channelModel: CreateChannelDtoPayloadModel): Observable<CreateChannelDtoResultModel>
  {
    return this._restService.createChannel(channelModel);
  }
}
