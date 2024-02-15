import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthDataService}              from '../../../auth/shared/auth.data.service';
import {BaseSubscription}             from '../../core/base.subscription';
import {isEmptyArray}                 from '../../core/core.free.functions';
import {MessageType}                  from '../../core/message.type';
import {EActionType}                  from '../../models/event.type';
import {OperationResult}              from '../../models/operation.result.model';
import {GlobalBusService}             from '../../services/global.bus.service';

@Component({
             selector:    'base-component',
             templateUrl: './base.component.html',
             styleUrls:   ['./base.component.css']
           })
export abstract class BaseComponent extends BaseSubscription implements OnInit, OnDestroy
{
  public informationMessages: OperationResult[] = [];
  public isLoggedIn: boolean = false;
  public userName: string;
  public loading:boolean = false;
  public blockButton:boolean = false;
  protected constructor(protected serviceBus: GlobalBusService,
                        protected authService?: AuthDataService)
  {
    super();
    this.__loadUserInfo();
  }

  protected clearInformationMessages(): void
  {
    this.informationMessages = [];
  }

  protected onSubscribeData()
  {
    super.onSubscribeData();
    if (this.authService)
    {
      this.subscribe(this.authService.loggedIn.subscribe(isLoggedIn => this.isLoggedIn = isLoggedIn));
      this.subscribe(this.authService.userName.subscribe((userName: string) => this.userName = userName))
    }
    this.subscribe(this.serviceBus.onEvent(EActionType.ON_LOGIN_ACTION, (result: boolean) => this.onAfterLoginAction(result)));
    this.subscribe(this.serviceBus.onEvent(EActionType.ON_LOGOUT_ACTION, (result: boolean) => this.onAfterLogoutAction(result)));
    this.subscribe(this.serviceBus.onEvent(EActionType.ON_REFRESH_ALL_DATA_ACTION, (result: boolean) => this.onRefreshAllDataAction(result)));
  }

  protected onAfterLoginAction(value: boolean): void
  {

  }

  protected onAfterLogoutAction(value: boolean): void
  {

  }

  protected onRefreshAllDataAction(value: boolean): void
  {

  }

  protected addInformationMessage(id: number, message: string): void
  {
    this.informationMessages.push(new OperationResult(id, message));
  }

  protected showMessages(items: OperationResult[]): void
  {
    !isEmptyArray(items) && items.forEach(item => item.id < 0 ? this.showError(`${item.id}. ${item.message}`) : this.showInfo(`${item.id}. ${item.message}`));
  }

  protected showError(detail: string, title?: string): void
  {
    this.serviceBus.showMessage(MessageType.ERROR, title, detail);
  }

  protected showSuccess(detail: string, title?: string): void
  {
    this.serviceBus.showMessage(MessageType.SUCCESS, title, detail);
  }

  protected showWarning(detail: string, title?: string): void
  {
    this.serviceBus.showMessage(MessageType.WARNING, title, detail);
  }

  protected showInfo(detail: string, title?: string): void
  {
    this.serviceBus.showMessage(MessageType.INFO, title, detail);
  }

  private __loadUserInfo(): void
  {
    this.isLoggedIn = this.authService ? this.authService.isLoggedIn() : false;
    this.userName = this.authService ? this.authService.getUserName() : null;
  }
}
