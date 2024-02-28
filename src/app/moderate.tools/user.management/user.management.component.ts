import {Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {BaseComponent}                                                 from '../../common/components/base.component/base.component';
import {executeIf, isChangedAndNotNullOrUndefined}                     from '../../common/core/core.free.functions';
import {GlobalBusService}                                              from '../../common/services/global.bus.service';
import {ModerateToolsScreenDataModel}                                  from '../models/moderate.tools.screen.data.model';

@Component({
             selector:    'user-management',
             templateUrl: './user.management.component.html',
             styleUrls:   ['./user.management.component.css']
           })
export class UserManagementComponent extends BaseComponent implements OnInit, OnDestroy, OnChanges
{
  @Input() channelId: number;
  public sD: ModerateToolsScreenDataModel = new ModerateToolsScreenDataModel();

  constructor(serviceBus: GlobalBusService)
  {
    super(serviceBus);
  }

  public ngOnChanges(changes: SimpleChanges)
  {
    executeIf(isChangedAndNotNullOrUndefined(changes, 'channelId'), () => this.channelId);
  }
}
