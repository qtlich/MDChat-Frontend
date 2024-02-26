import {Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {BaseComponent}                                                 from '../../common/components/base.component/base.component';
import {executeIf, isChangedAndNotNullOrUndefined}                     from '../../common/core/core.free.functions';
import {GlobalBusService}                                              from '../../common/services/global.bus.service';
import {ModerateToolsScreenDataModel}                                  from '../models/moderate.tools.screen.data.model';

@Component({
             selector:    'channel-management',
             templateUrl: './channel.management.component.html',
             styleUrls:   ['./channel.management.component.css']
           })
export class ChannelManagementComponent extends BaseComponent implements OnInit, OnDestroy, OnChanges
{
  @Input() channelId: number;
  public sD: ModerateToolsScreenDataModel = new ModerateToolsScreenDataModel();

  constructor(serviceBus: GlobalBusService)
  {
    super(serviceBus);
  }

  public ngOnChanges(changes: SimpleChanges)
  {
    executeIf(isChangedAndNotNullOrUndefined(changes, 'channelId'), () => console.log('IN user management channelId===>', this.channelId));
  }
}
