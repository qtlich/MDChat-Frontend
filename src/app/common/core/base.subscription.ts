import {OnDestroy, OnInit} from '@angular/core';
import {Subscription}      from 'rxjs';
import {BaseTableColumn}   from './base.table.column';
import {isNullOrUndefined} from './core.free.functions';

export abstract class BaseSubscription extends BaseTableColumn implements OnInit, OnDestroy
{
  private _subscriptions: Subscription[] = [];

  //*********************************************************************************************
  protected constructor()
  {
    super();
  }

  //*********************************************************************************************
  public ngOnDestroy(): void
  {
    this.__unsubscribe();
  }

  //*********************************************************************************************
  public ngOnInit(): void
  {
    this.__subscribeOnData();
  }

  //*********************************************************************************************
  protected subscribe(item: Subscription): void
  {
    this._subscriptions.push(item);
  }

  //*********************************************************************************************
  /**
   * Підписка на дані
   * Можна перекрити у нащадку
   */
  protected onSubscribeData(): void
  {
  }

  //*********************************************************************************************
  private __subscribeOnData(): void
  {
    this._subscriptions = [];
    this.onSubscribeData();
  }

  //*********************************************************************************************
  private __unsubscribe(): void
  {
    this._subscriptions.forEach(item => !isNullOrUndefined(item) && item.unsubscribe());
    this._subscriptions = [];
  }
}
