import {HttpClient}        from '@angular/common/http';
import {Injectable}        from '@angular/core';
import {CommonBaseRestApi} from '../core/common.base.rest.api';
import {AppConfigService}  from '../services/app.config.service';

@Injectable({
              providedIn: 'root'
            })
export class GlobalBusRestService extends CommonBaseRestApi
{
  constructor(httpClient: HttpClient,
              configService: AppConfigService)
  {
    super(httpClient, configService);
  }
}
