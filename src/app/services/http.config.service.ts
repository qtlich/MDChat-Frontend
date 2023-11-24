import {Injectable} from "@angular/core";

@Injectable({providedIn: "root"})
export class HttpConfigService
{

  private readonly _baseApiUrl:string = "http://localhost:8080/api";
  public get baseApiUrl():string
  {
    return this._baseApiUrl;
  }
  constructor()
  {
  }

}
