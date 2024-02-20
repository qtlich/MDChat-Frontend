import {Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {Router}                                                        from '@angular/router';
import {BaseComponent}                                                                       from '../../common/components/base.component/base.component';
import {errorToText, executeIf, isChangedAndNotNullOrUndefined, isChangedAndNullOrUndefined} from '../../common/core/core.free.functions';
import {GlobalBusService}                                                                    from '../../common/services/global.bus.service';
import {ChannelRestService}                 from '../../services/channels/channel.rest.service';
import {GetChannelDescriptionRequestModel} from '../models/get.channel.description.request.model';
import {GetChannelDescriptionResponseModel} from '../models/get.channel.description.response.model';

@Component({
             selector:    'channel-description-side-bar',
             templateUrl: './view-channel-description.component.html',
             styleUrls:   ['./view-channel-description.component.css']
           })
export class ViewChannelDescriptionComponent extends BaseComponent implements OnInit, OnDestroy, OnChanges
{
  public channel: GetChannelDescriptionResponseModel;
  @Input() channelId: number;

  constructor(private _channelService:ChannelRestService,
              serviceBus:GlobalBusService)
  {
    super(serviceBus);
  }

  public ngOnChanges(changes: SimpleChanges)
  {
    executeIf(isChangedAndNotNullOrUndefined(changes, 'channelId'), () => this.__load());
  }

  public ngOnInit()
  {
    super.ngOnInit();
    // this.__load();
  }

  private __load(): void
  {
    this._channelService.getChannelDescription(new GetChannelDescriptionRequestModel(this.channelId)).subscribe((channel:GetChannelDescriptionResponseModel) =>
                                                             {
                                                               this.channel = channel;
                                                             }, error =>
                                                             {
                                                               this.showError(errorToText(error));
                                                             });
  }
}
