import {Component, OnDestroy, OnInit}       from '@angular/core';
import {ActivatedRoute}                     from '@angular/router';
import {GetChannelDescriptionRequestModel}  from '../channel/models/get.channel.description.request.model';
import {GetChannelDescriptionResponseModel} from '../channel/models/get.channel.description.response.model';
import {BaseComponent}                      from '../common/components/base.component/base.component';
import {toNumber}                           from '../common/core/core.free.functions';
import {GlobalBusService}                   from '../common/services/global.bus.service';
import {ChannelDataService}                 from '../services/channels/channel.data.service';
import {ModerateToolsScreenDataModel}       from './models/moderate.tools.screen.data.model';

@Component({
             selector:    'moderate-tools',
             templateUrl: './moderate.tools.component.html',
             styleUrls:   ['./moderate.tools.component.css']
           })
export class ModerateToolsComponent extends BaseComponent implements OnInit, OnDestroy
{
  public sD: ModerateToolsScreenDataModel = new ModerateToolsScreenDataModel();

  constructor(private _route: ActivatedRoute,
              private _channelService: ChannelDataService,
              serviceBus: GlobalBusService)
  {
    super(serviceBus);
  }

  protected onSubscribeData(): void
  {
    super.onSubscribeData();
    this.subscribe(this._route.paramMap.subscribe(params =>
                                                  {
                                                    this.sD.channelId = toNumber(params.get('channelid'));
                                                  }));
    this.subscribe(this._channelService.onLoadChannelDescriptionEvent().subscribe((data: GetChannelDescriptionResponseModel) =>
                                                                                  {
                                                                                    this.sD.channelInfo = data;
                                                                                    this.sD.channelId = data.channelId;
                                                                                  }));
  }

  private __loadChannelDescription(): void
  {
    this._channelService.getChannelDescription(new GetChannelDescriptionRequestModel(this.sD.channelId));
  }
}
