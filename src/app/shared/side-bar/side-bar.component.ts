import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router}                       from '@angular/router';
import {AuthDataService}              from '../../auth/shared/auth.data.service';
import {BaseComponent}                from '../../common/components/base.component/base.component';
import {GlobalBusService}             from '../../common/services/global.bus.service';

@Component({
             selector:    'create-channel-post-side-bar',
             templateUrl: './side-bar.component.html',
             styleUrls:   ['./side-bar.component.css']
           })
export class SideBarComponent extends BaseComponent implements OnInit, OnDestroy
{

  constructor(private router: Router,
              serviceBus: GlobalBusService,
              authService?: AuthDataService)
  {
    super(serviceBus, authService);
  }

  public goToCreatePost(): void
  {
    this.router.navigateByUrl('/create-post');
  }

  public goToCreateChannel(): void
  {
    this.router.navigateByUrl('/create-channel');
  }

}
