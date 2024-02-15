import {HttpClient}                                                        from '@angular/common/http';
import {Observable}                                                        from 'rxjs';
import {AppConfigService}                                                  from '../services/app.config.service';
import {API_URL_TYPE, ApiFunctionParams, BaseApi, HeaderItem, MEDIA_TYPES} from './base.api';

/**
 * Base functions for working with server
 */
export abstract class BaseRestApi extends BaseApi
{
  protected constructor(private _httpClient: HttpClient,
                        configService: AppConfigService)
  {
    super(configService);
  }

  //*********************************************************************************************
  protected delete<R>(Url: string,
                      params: ApiFunctionParams = {API_TYPE: API_URL_TYPE.API_URL, MEDIA_TYPE: MEDIA_TYPES.APPLICATION_JSON, USE_CACHE: false, TIME_IN_CACHE: null},
                      additional_params?: HeaderItem[]): Observable<R>
  {
    return this._httpClient.delete<R>(`${this.getApiURL(params)}${Url}`, {headers: this.createHttpHeaders(params, additional_params)});
  }

  //*********************************************************************************************
  protected get<R>(Url: string,
                   params: ApiFunctionParams = {API_TYPE: API_URL_TYPE.API_URL, MEDIA_TYPE: MEDIA_TYPES.APPLICATION_JSON, USE_CACHE: false, TIME_IN_CACHE: null},
                   additional_params?: HeaderItem[]): Observable<R>
  {
    return this._httpClient.get<R>(`${this.getApiURL(params)}${Url}`, {headers: this.createHttpHeaders(params, additional_params)});
  }

  //*********************************************************************************************
  protected post<P, R>(Url: string, item: P,
                       params: ApiFunctionParams                              = {API_TYPE: API_URL_TYPE.API_URL, MEDIA_TYPE: MEDIA_TYPES.APPLICATION_JSON, USE_CACHE: false, TIME_IN_CACHE: null},
                       responseType: 'arraybuffer' | 'blob' | 'json' | 'text' = 'json',
                       additional_params?: HeaderItem[]
  ): Observable<R>
  {
    const headers = this.createHttpHeaders(params, additional_params);
    const requestOptions: Object = {
      headers:      headers,
      responseType: responseType
    }
    return this._httpClient.post<any>(`${this.getApiURL(params)}${Url}`, this.transformObject<P>(item, params),
                                      requestOptions);
  }

  //*********************************************************************************************
  protected put<P, R>(Url: string, item: P,
                      params: ApiFunctionParams = {API_TYPE: API_URL_TYPE.API_URL, MEDIA_TYPE: MEDIA_TYPES.APPLICATION_JSON, USE_CACHE: false, TIME_IN_CACHE: null},
                      additional_params?: HeaderItem[]): Observable<R>
  {
    return this._httpClient.put<R>(`${this.getApiURL(params)}${Url}`, this.transformObject<P>(item, params), {headers: this.createHttpHeaders(params, additional_params)});
  }

  //*********************************************************************************************
  protected getXML(Url: string,
                   params: ApiFunctionParams = {API_TYPE: API_URL_TYPE.API_URL, MEDIA_TYPE: MEDIA_TYPES.APPLICATION_JSON, USE_CACHE: false, TIME_IN_CACHE: null},
                   additional_params?: HeaderItem[])
  {
    return this._httpClient.get(`${this.getApiURL(params)}${Url}`, {headers: this.createHttpHeaders(params, additional_params), responseType: 'text'});
  }

  protected postMultipartFormData<T>(Url: string,
                                     object                    = null,
                                     params: ApiFunctionParams = {API_TYPE: API_URL_TYPE.API_URL, MEDIA_TYPE: MEDIA_TYPES.APPLICATION_JSON, USE_CACHE: false, TIME_IN_CACHE: null},
                                     additional_params?: HeaderItem[]): Observable<T>
  {
    return this._httpClient.post<T>(`${this.getApiURL(params)}${Url}`, object);
  }
}
