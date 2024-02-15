import {Injectable}                                       from '@angular/core';
import {MessageService}                                   from 'primeng-lts/api';
import {Observable, ReplaySubject, Subject, Subscription} from 'rxjs';
import {filter, map}                 from 'rxjs/operators';
import {AuthDataService}                                  from '../../auth/shared/auth.data.service';
import {showOperationResultMessages} from '../core/core.free.functions';
import {MessageType}                 from '../core/message.type';
import {BusEvent}                                         from '../models/bus.event';
import {EActionType}                                      from '../models/event.type';
import {GlobalBusRestService}                             from '../models/global.bus.rest.service';
import {OperationResult}                                  from '../models/operation.result.model';
import {UiBlockInterfaceInput}                            from '../models/ui.block.input.model';

@Injectable({
              providedIn: 'root'
            })
export class GlobalBusService
{
  private _cashedEventSubject: ReplaySubject<BusEvent<any>> = new ReplaySubject<BusEvent<any>>(1);
  private _eventSubject: Subject<BusEvent<any>> = new Subject<BusEvent<any>>();
  private readonly _onLoadingSubject: ReplaySubject<UiBlockInterfaceInput> = new ReplaySubject(1);

  constructor(private _restService: GlobalBusRestService)
  {
  }
  public clear(): void
  {
    this.sendCashedEvent<null>(EActionType.EMPTY, null);
  }

  public onCashedEvent<T>(type: EActionType, action: any): Subscription
  {
    return this._cashedEventSubject.pipe(filter(e => e.type === type), map(e => e.payload)).subscribe(action);
  }

  public onEvent<T>(type: EActionType, action: any): Subscription
  {
    return this._eventSubject.pipe(filter(e => e.type === type), map(e => e.payload)).subscribe(action);
  }

  public onEvents<T>(types: EActionType[], action: any): Subscription
  {
    //this._eventSubject.filter(e => types.some(item => item == e.type)).map(e => e.payload).subscribe(action);
    return this._eventSubject.pipe(filter(e => types.some(item => item === e.type)), map(e => e.payload)).subscribe(action);
  }

  public onLoadingEvent(): Observable<UiBlockInterfaceInput>
  {
    return this._onLoadingSubject;
  }

  public sendCashedEvent<T>(type: EActionType, payload: T): void
  {
    console.log('sendCashedEvent->', type, 'payload', payload);
    this._cashedEventSubject.next(new BusEvent<T>(type, payload));
  }

  public sendEvent<T>(type: EActionType, payload: T): void
  {
    console.log('sendEvent->', type, 'payload', payload);
    this._eventSubject.next(new BusEvent<T>(type, payload));
  }

  public showMessage(type: MessageType, detail: string, title?: string): void
  {
    switch (type)
    {
      case MessageType.SUCCESS:
        this.showSuccess(title, detail);
        break;
      case MessageType.ERROR:
        this.showError(title, detail);
        break;
      case MessageType.WARNING:
        this.showWarning(title, detail);
        break;
      case MessageType.INFO:
      default:
        this.showInfo(title, detail);
    }
  }

  public showMessages(items: OperationResult[]): void
  {
    showOperationResultMessages(this, items);
  }

  public startLoading(message?: string): void
  {
    this._onLoadingSubject.next(<UiBlockInterfaceInput>{blocked: true, message: message});
  }

  public showError(title: string, detail?: string): void
  {
    this.sendEvent(EActionType.SHOW_INFORMATION_MESSAGE, {severity: 'error', summary: title, detail: detail});
  }

  public showSuccess(title: string, detail?: string): void
  {
    this.sendEvent(EActionType.SHOW_INFORMATION_MESSAGE, {severity: 'success', summary: title, detail: detail});
  }

  public showWarning(title: string, detail?: string): void
  {
    this.sendEvent(EActionType.SHOW_INFORMATION_MESSAGE, {severity: 'warn', summary: title, detail: detail});
  }

  public showInfo(title: string, detail?: string): void
  {
    this.sendEvent(EActionType.SHOW_INFORMATION_MESSAGE, {severity: 'info', summary: title, detail: detail});
  }

}
