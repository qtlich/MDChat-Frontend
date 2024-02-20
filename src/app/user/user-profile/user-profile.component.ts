import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthDataService}              from '../../auth/shared/auth.data.service';
import {BaseComponent}                from '../../common/components/base.component/base.component';
import {GlobalBusService}             from '../../common/services/global.bus.service';

@Component({
             selector:    'user-profile',
             templateUrl: './user-profile.component.html',
             styleUrls:   ['./user-profile.component.css']
           })
export class UserProfileComponent extends BaseComponent implements OnInit, OnDestroy
{
  constructor(serviceBus: GlobalBusService,
              authService: AuthDataService)
  {
    super(serviceBus, authService);
  }

  public onChangeTab(index: number): void
  {
    console.log('Index=>', index);
  }
}
