import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router}       from '@angular/router';
import {BaseComponent}                from '../common/components/base.component/base.component';
import {toNumber}                     from '../common/core/core.free.functions';
import {GlobalBusService}             from '../common/services/global.bus.service';
import {ModerateToolsScreenDataModel} from './models/moderate.tools.screen.data.model';

@Component({
             selector:    'moderate-tools',
             templateUrl: './moderate.tools.component.html',
             styleUrls:   ['./moderate.tools.component.css']
           })
export class ModerateToolsComponent extends BaseComponent implements OnInit, OnDestroy
{
  public sD: ModerateToolsScreenDataModel = new ModerateToolsScreenDataModel();

  constructor(private _route: ActivatedRoute,
              serviceBus: GlobalBusService)
  {
    super(serviceBus);
  }

  protected onSubscribeData()
  {
    super.onSubscribeData();
    this.subscribe(this._route.paramMap.subscribe(params =>this.sD.channelId = toNumber(params.get('channelid'))));
  }
}
