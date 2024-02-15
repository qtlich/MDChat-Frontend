export class BaseClone
{
  public debugMode: boolean = false;
  protected storageName: string = 'globalStorageName';

  constructor()
  {
  }

  protected setStorageName(value: string): void
  {
    this.storageName = value;
  }
}
