import {Observable, Subject} from 'rxjs';
import {BaseService}         from '../../../services/base.service';
import {GlobalBusService} from '../../../services/global.bus.service';
import {BaseSearchRestService} from './base.search.rest.service';

export abstract class BaseSearchDataService<TSearchCriteria,TResult,TRestService extends BaseSearchRestService<TSearchCriteria,TResult>> extends BaseService
{
  private readonly _onLoadDataSubject:Subject<TResult> = new Subject<TResult>();
  protected constructor(protected rS:TRestService,
    serviceBus: GlobalBusService)
  {
    super(serviceBus);
  }
  public onLoadDataEvent():Observable<TResult>
  {
    return this._onLoadDataSubject;
  }
  protected handleLoadData(data:TResult):void
  {
    this._onLoadDataSubject.next(data);
  }
  public loadData(item:TSearchCriteria):void
  {
    this.toDb<TSearchCriteria,TResult>(item,
                                       input=>this.rS.loadData(input),
                                       (data:TResult)=>this.handleLoadData(data),
                                       `Can't load data`);
  }
}
