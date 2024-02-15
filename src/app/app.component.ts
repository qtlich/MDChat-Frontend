import {Component, OnDestroy, OnInit} from '@angular/core';
import {Message, MessageService}      from 'primeng/api';
import {Subscription}                 from 'rxjs';
import {EActionType}                  from './common/models/event.type';
import {AppConfigService}             from './common/services/app.config.service';
import {GlobalBusService}             from './common/services/global.bus.service';

/**
 * need execute in cmd as administrator
 * set NODE_OPTIONS=--openssl-legacy-provider
 */
@Component({
             selector:    'app-root',
             templateUrl: './app.component.html',
             styleUrls:   ['./app.component.css'],
             providers:   [MessageService]
           })
export class AppComponent implements OnInit, OnDestroy
{
  title = 'MDChat';
  private _subscription: Subscription;

  constructor(private _configService: AppConfigService,
              public messageService: MessageService,
              private _serviceBus: GlobalBusService)
  {
    this.title = this._configService.config.title;
  }

  public ngOnInit()
  {
    this._subscription = this._serviceBus.onEvent(EActionType.SHOW_INFORMATION_MESSAGE, (message: Message) => this.messageService.add(message));
  }

  public ngOnDestroy()
  {
    this._subscription && this._subscription.unsubscribe();
  }
}
