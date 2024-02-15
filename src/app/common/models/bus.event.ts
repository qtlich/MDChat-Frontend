import {EActionType} from './event.type';

export class BusEvent<T>
{
  constructor(private _type: EActionType,
              private _payload: T)
  {
  }

  public get payload(): T
  {
    return this._payload;
  }

  public get type(): EActionType
  {
    return this._type;
  }
}
