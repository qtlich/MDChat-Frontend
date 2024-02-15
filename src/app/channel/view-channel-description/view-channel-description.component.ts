import {Component, Input}     from '@angular/core';
import {Router}               from '@angular/router';
import {BaseComponent}        from '../../common/components/base.component/base.component';
import {errorToText}          from '../../common/core/core.free.functions';
import {GlobalBusService}     from '../../common/services/global.bus.service';
import {ChannelRestService}   from '../../services/channels/channel.rest.service';
import {ChannelResponseModel} from '../models/channel.response.model';

@Component({
             selector:    'channel-description-side-bar',
             templateUrl: './view-channel-description.component.html',
             styleUrls:   ['./view-channel-description.component.css']
           })
export class ViewChannelDescriptionComponent extends BaseComponent
{
  channel: ChannelResponseModel;
  @Input() channelId: number;
  modules = {
    "toolbar": false
  }

  constructor(private _channelService:ChannelRestService,
              serviceBus:GlobalBusService)
  {
    super(serviceBus);
  }

  public ngOnInit()
  {
    super.ngOnInit();
    this.__load();
  }

  private __load(): void
  {
    this._channelService.getChannel(this.channelId).subscribe(data =>
                                                             {
                                                               this.channel = data;
                                                             }, error =>
                                                             {
                                                               this.showError(errorToText(error));
                                                             });
  }
}
