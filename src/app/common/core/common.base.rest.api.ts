import {HttpClient}       from '@angular/common/http';
import {AppConfigService} from '../services/app.config.service';
import {BaseRestApi}      from './base.rest.api';

export abstract class CommonBaseRestApi extends BaseRestApi
{
  protected constructor(httpClient: HttpClient,
                        configService: AppConfigService)
  {
    super(httpClient, configService);
  }
}
