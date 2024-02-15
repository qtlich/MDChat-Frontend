import {Observable, Subject, Subscription} from 'rxjs';
import {finalize, take}                    from 'rxjs/operators';
import {toString}                          from '../core/core.free.functions';
import {MessageType}                       from '../core/message.type';
import {GlobalBusService}                  from './global.bus.service';

export abstract class BaseService
{
  private readonly _blockButtonSubject: Subject<boolean> = new Subject<boolean>();
  private readonly _onLoadingSubject: Subject<boolean> = new Subject();
  private _subscriptions: Subscription[] = [];

  protected constructor(protected serviceBus: GlobalBusService)
  {
  }

  public onBlockButtonEvent(): Observable<boolean>
  {
    return this._blockButtonSubject;
  }

  public onLoadingEvent(): Observable<boolean>
  {
    return this._onLoadingSubject;
  }

  public showMessage(type: MessageType, message: string, title?: string): void
  {
    this.serviceBus.showMessage(type, message, title);
  }

  protected addToSubscription(item: Subscription): void
  {
    this._subscriptions.push(item);
  }

  protected blockButton(state: boolean = true): void
  {
    this._blockButtonSubject.next(state);
  }

  protected endLoading(): void
  {
    this._onLoadingSubject.next(false);
    this.__blockButton(false);
  }

  protected onSubscribeData(): void
  {
  }

  protected startLoading(message?: string): void
  {
    this._onLoadingSubject.next(true);
    this.__blockButton();
  }

  protected toDb<TInputParametersRestFunction, TResultParameterRestFunction>(input: TInputParametersRestFunction,
                                                                             restFunction: (item: TInputParametersRestFunction) => Observable<TResultParameterRestFunction>,
                                                                             subscribeFunc: (data: TResultParameterRestFunction) => void,
                                                                             errorMessage: string,
                                                                             starMessage?: string,
                                                                             sendLoadingEvent: boolean = true,
                                                                             errorFunction?: (error: any) => void): void
  {
    this.blockButton();
    sendLoadingEvent && this.startLoading(starMessage);
    restFunction(input)
    restFunction(input).pipe(
                         take(1),
                         finalize(() => this.blockButton(false)))
                       .subscribe(data =>
                                  {
                                    sendLoadingEvent && this.endLoading();
                                    subscribeFunc(data);
                                  },
                                  (error: Error) =>
                                  {
                                    this.showMessage(MessageType.ERROR, errorMessage + '. Error code:' + toString(error.message));
                                    sendLoadingEvent && this.endLoading();
                                    errorFunction && errorFunction(error);
                                  });
  }

  private __blockButton(state: boolean = true): void
  {
    this._blockButtonSubject.next(state);
  }
}
