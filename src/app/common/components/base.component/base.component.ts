import {Component, OnDestroy, OnInit} from '@angular/core';
import {MessageService}               from 'primeng/api';

@Component({
             selector:    'base-component',
             templateUrl: './base.component.html',
             styleUrls:   ['./base.component.css']
           })
export abstract class BaseComponent implements OnInit,OnDestroy
{
  protected constructor(private _messageService:MessageService)
  {
  }

  public ngOnInit()
  {
  }

  public ngOnDestroy()
  {
  }
  protected showError(detail:string,summary?:string,):void
  {
    this._messageService.add({severity: 'error', summary:summary, detail:detail});
  }
  protected showSuccess(detail:string,summary?:string,):void
  {
    this._messageService.add({severity: 'success', summary:summary, detail:detail});
  }
  protected showWarning(detail:string,summary?:string,):void
  {
    this._messageService.add({severity: 'warn', summary:summary, detail:detail});
  }
}
