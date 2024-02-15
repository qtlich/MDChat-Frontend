import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {ConfigFile} from '../models/config.file.model';

@Injectable({
              providedIn: 'root'
            })
export class AppConfigService
{
  private _config: ConfigFile = new ConfigFile();

  constructor(private _httpClient: HttpClient)
  {
  }

  public get config(): ConfigFile
  {
    return this._config;
  }

  public load(): Promise<ConfigFile>
  {
    return this._httpClient
               .get<ConfigFile>('/assets/config/app.config.json')
               .toPromise()
               .then(data =>
                     {
                       this._config = <ConfigFile>data;
                       return data;
                     });
  }
}
