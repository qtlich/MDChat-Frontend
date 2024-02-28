import {HttpClient}             from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {BaseRestApi}            from '../../../core/base.rest.api';
import {AppConfigService}       from '../../../services/app.config.service';

export abstract class BaseSearchRestService<TSearchCriteria, TResult> extends BaseRestApi
{
  protected constructor(httpClient: HttpClient,
                        configService: AppConfigService)
  {
    super(httpClient, configService);
  }

  public loadData(item: TSearchCriteria): Observable<TResult>
  {
    return throwError(`override me ->loadData`);
  }
}
