import {Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {ConfirmationService}                                           from 'primeng-lts';
import {AuthDataService}                                               from '../../auth/shared/auth.data.service';
import {BaseComponent}                                                 from '../../common/components/base.component/base.component';
import {executeIf, isChangedAndNotNullOrUndefined, isNullOrUndefined}  from '../../common/core/core.free.functions';
import {EActionType}                                                   from '../../common/models/event.type';
import {GlobalBusService}                                              from '../../common/services/global.bus.service';
import {ChannelDataService, OnChangeUserChannelSubscriptionResult}     from '../../services/channels/channel.data.service';
import {ChangeUserChannelSubscriptionRequestModel}                     from '../../services/channels/models/change.user.channel.subscription.request.model';
import {GetChannelCountSubscribersResponseModel}                       from '../../services/channels/models/get.channel.count.subscribers.response.model';
import {GetUserChannelSubscriptionRequestModel}                        from '../../services/channels/models/get.user.channel.subscription.request.model';
import {GetUserChannelSubscriptionResponseModel}                       from '../../services/channels/models/get.user.channel.subscription.response.model';

@Component({
             selector:    'join-to-channel',
             templateUrl: './join-to-channel.component.html',
             styleUrls:   ['./join-to-channel.component.css'],
             providers:   [ConfirmationService]
           })
export class JoinToChannelComponent extends BaseComponent implements OnInit, OnDestroy, OnChanges
{
  @Input() channelId: number;
  public isSubscribed = false;
  public buttonText = 'Join';

  constructor(private _channelDataService: ChannelDataService,
              serviceBus: GlobalBusService,
              authService?: AuthDataService)
  {
    super(serviceBus, authService);
  }

  public ngOnChanges(changes: SimpleChanges)
  {
    executeIf(isChangedAndNotNullOrUndefined(changes, 'channelId'), () => this.__refresh());
  }

  private __refresh(): void
  {
    this._channelDataService.getChannelSubscription(new GetUserChannelSubscriptionRequestModel(null,
                                                                                               !isNullOrUndefined(this.channelId) ? this.channelId : null));
  }

  public toggleSubscription(): void
  {
    this._channelDataService.changeChannelSubscription(new ChangeUserChannelSubscriptionRequestModel(null,
                                                                                                     this.channelId));
    this.isSubscribed = !this.isSubscribed;
    this.__updateButtonText();
  }

  protected onSubscribeData()
  {
    super.onSubscribeData();
    this.subscribe(this._channelDataService.onLoadUserChannelSubscriptionEvent().subscribe((result: GetUserChannelSubscriptionResponseModel) =>
                                                                                           {
                                                                                             if(result.channelId == this.channelId)
                                                                                             {
                                                                                               this.isSubscribed = result.isSubscribed;
                                                                                             }
                                                                                             this.__updateButtonText();
                                                                                           }))
    this.subscribe(this._channelDataService.onLoadUserChannelSubscriptionEvent().subscribe((result: GetChannelCountSubscribersResponseModel) =>
                                                                                           {
                                                                                             if(result.channelId == this.channelId)
                                                                                             {
                                                                                               // this.isSubscribed = result.isSubscribed;
                                                                                             }
                                                                                             this.__updateButtonText();
                                                                                           }))
    this.subscribe(this.serviceBus.onEvent(EActionType.ON_CHANGE_CHANNEL_SUBSCRIPTION_ACTION, (result: OnChangeUserChannelSubscriptionResult) =>
    {
      result.success && result.item.channelId == this.channelId && this.__refresh();
    }))
  }

  public onMouseOver(): void
  {
    this.isSubscribed && this.__updateButtonTextOnHover(true);
  }

  public onMouseLeave(): void
  {
    this.__updateButtonTextOnHover(false);
  }

  private __updateButtonTextOnHover(isHovered: boolean): void
  {
    if(this.isSubscribed)
    {
      this.buttonText = isHovered ? 'Leave' : 'Joined';
    }
    else
    {
      this.buttonText = 'Join';
    }
  }

  private __updateButtonText(): void
  {
    if(this.isSubscribed)
    {
      this.buttonText = 'Joined';
    }
    else
    {
      this.buttonText = 'Join';
    }
  }
}
