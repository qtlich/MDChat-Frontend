import {Component, OnDestroy, OnInit} from '@angular/core';
import {throwError}                   from 'rxjs';
import {AuthDataService}              from '../../../auth/shared/auth.data.service';
import {isEmptyArray}                 from '../../core/core.free.functions';
import {GlobalBusService}             from '../../services/global.bus.service';
import {BaseComponent}                from '../base.component/base.component';

@Component({
             selector:    'base-search-component',
             templateUrl: './base.search.component.html',
             styleUrls:   ['./base.search.component.css']
           })
export abstract class BaseSearchComponent<TSearchCriteria, TResult> extends BaseComponent implements OnInit, OnDestroy
{
  public items: TResult[] = [];
  public selectedItem: TResult;
  public showSortBar: boolean = false;
  protected offset: number = 0;
  protected limit: number = 100;

  protected constructor(protected serviceBus: GlobalBusService,
                        protected authService?: AuthDataService)
  {
    super(serviceBus, authService);
  }

  public onRowSelect(item: TResult): void
  {
  }

  protected load(first: number = 0, rows: number = 100): void
  {
    this.offset = first;
    this.limit = rows;
    this.__refreshData();
  }

  protected onSubscribeData(): void
  {
    super.onSubscribeData();
  }

  protected loadData(item: TSearchCriteria): void
  {
    throwError(`Error`);
  }

  protected isValidDataForRefresh(): void
  {

  }

  private __refreshData(): void
  {
    if(this.__isValidDataForRefresh())
    {
      this.loadData(this.prepareDataForSearch());
    }
    else
    {
      this.serviceBus.showMessages(this.informationMessages);
    }
  }

  protected prepareDataForSearch(): TSearchCriteria
  {
    return;
  }

  private __isValidDataForRefresh(): boolean
  {
    this.clearInformationMessages();
    this.isValidDataForRefresh();
    return isEmptyArray(this.informationMessages);
  }
}
