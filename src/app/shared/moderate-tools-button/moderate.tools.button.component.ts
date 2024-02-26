import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Router}                              from '@angular/router';
import {AuthDataService}                     from '../../auth/shared/auth.data.service';
import {BaseComponent}                       from '../../common/components/base.component/base.component';
import {GlobalBusService}                    from '../../common/services/global.bus.service';

@Component({
             selector:    'moderate-channel-button',
             templateUrl: './moderate.tools.button.component.html',
             styleUrls:   ['./moderate.tools.button.component.css']
           })
export class ModerateToolsButtonComponent extends BaseComponent implements OnInit, OnDestroy
{
  @Input() channelId: number;

  constructor(private _router: Router,
              serviceBus: GlobalBusService,
              authService?: AuthDataService)
  {
    super(serviceBus, authService);
  }

  public goToModerateChannelTool(): void
  {
    this._router.navigate([`moderatechannel/${this.channelId}`]);
  }
}
