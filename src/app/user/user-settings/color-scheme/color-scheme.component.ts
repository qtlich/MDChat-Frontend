import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthDataService}              from '../../../auth/shared/auth.data.service';
import {BaseComponent}                from '../../../common/components/base.component/base.component';
import {GlobalBusService}     from '../../../common/services/global.bus.service';
import {themes, ThemeService} from '../../../services/theme.service';

@Component({
             selector:    'color-scheme',
             templateUrl: './color-scheme.component.html',
             styleUrls:   ['./color-scheme.component.css']
           })
export class ColorSchemeComponent extends BaseComponent implements OnInit, OnDestroy
{
  constructor(private _themeService: ThemeService,
              serviceBus: GlobalBusService,
              authService: AuthDataService)
  {
    super(serviceBus, authService);
  }

  public changeTheme(theme: string)
  {
    this._themeService.switchTheme(theme);
  }

  protected readonly themes = themes;
}
