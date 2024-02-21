import {Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {BaseComponent}                                                 from '../../common/components/base.component/base.component';
import {errorToText, executeIf, isChangedAndNotNullOrUndefined}        from '../../common/core/core.free.functions';
import {EActionType}                                                   from '../../common/models/event.type';
import {GlobalBusService}                                              from '../../common/services/global.bus.service';
import {ChannelDataService, OnChangeUserChannelSubscriptionResult}     from '../../services/channels/channel.data.service';
import {ChannelRestService}                                            from '../../services/channels/channel.rest.service';
import {GetChannelCountSubscribersRequestModel}                        from '../../services/channels/models/get.channel.count.subscribers.request.model';
import {GetChannelCountSubscribersResponseModel}                       from '../../services/channels/models/get.channel.count.subscribers.response.model';
import {GetChannelDescriptionRequestModel}                             from '../models/get.channel.description.request.model';
import {GetChannelDescriptionResponseModel}                            from '../models/get.channel.description.response.model';

@Component({
             selector:    'channel-description-side-bar',
             templateUrl: './view-channel-description.component.html',
             styleUrls:   ['./view-channel-description.component.css']
           })
export class ViewChannelDescriptionComponent extends BaseComponent implements OnInit, OnDestroy, OnChanges
{
  public channel: GetChannelDescriptionResponseModel;
  public countSubscribers: number;
  @Input() channelId: number = 0;

  constructor(private _channelService: ChannelRestService,
              private _channelDataService: ChannelDataService,
              serviceBus: GlobalBusService)
  {
    super(serviceBus);
  }

  public ngOnChanges(changes: SimpleChanges)
  {
    executeIf(isChangedAndNotNullOrUndefined(changes, 'channelId'), () => this.__load());
  }

  protected onSubscribeData()
  {
    super.onSubscribeData();
    this.subscribe(this.serviceBus.onEvent<OnChangeUserChannelSubscriptionResult>(EActionType.ON_CHANGE_CHANNEL_SUBSCRIPTION_ACTION, (result: OnChangeUserChannelSubscriptionResult) =>
                                                                                  {
                                                                                    if(result.success && result.item.channelId == this.channelId)
                                                                                    {
                                                                                      this.__loadChannelCountSubscriptions();
                                                                                    }
                                                                                  }
    ));
    this.subscribe(this._channelDataService.onLoadChannelSubscribersEvent().subscribe((result: GetChannelCountSubscribersResponseModel) =>
                                                                                      {
                                                                                        console.log('onLoadChannelSubscribersEvent=>', result);
                                                                                        if(result.channelId = this.channelId)
                                                                                        {
                                                                                          this.countSubscribers = result.countSubscribers;
                                                                                        }
                                                                                      }));
  }

  private __loadChannelCountSubscriptions(): void
  {
    this._channelDataService.getChannelCountSubscribers(new GetChannelCountSubscribersRequestModel(null,
                                                                                                   this.channelId));
  }

  private __load(): void
  {
    this.__loadChannelCountSubscriptions();
    this._channelService.getChannelDescription(new GetChannelDescriptionRequestModel(this.channelId)).subscribe((channel: GetChannelDescriptionResponseModel) =>
                                                                                                                {
                                                                                                                  this.channel = channel;
                                                                                                                }, error =>
                                                                                                                {
                                                                                                                  this.showError(errorToText(error));
                                                                                                                });
  }
}
