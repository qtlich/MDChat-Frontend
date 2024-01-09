import {Component, OnDestroy, OnInit} from '@angular/core';
import {MessageService}               from 'primeng/api';
import {isEmptyArray}                 from '../../core.free.functions';
import {OperationResult}              from '../../models/operation.result.model';

@Component({
             selector:    'base-component',
             templateUrl: './base.component.html',
             styleUrls:   ['./base.component.css']
           })
export abstract class BaseComponent implements OnInit, OnDestroy
{
  public informationMessages: OperationResult[] = [];

  protected constructor(private _messageService: MessageService)
  {
  }

  public ngOnInit()
  {
  }

  public ngOnDestroy()
  {
  }

  protected clearInformationMessages(): void
  {
    this.informationMessages = [];
  }

  protected addInformationMessage(id: number, message: string): void
  {
    this.informationMessages.push(new OperationResult(id, message));
  }

  protected showMessages(items: OperationResult[]): void
  {
    !isEmptyArray(items)
    {
      items.forEach(item =>
                    {
                      if (item.id < 0)
                      {
                        this.showError(`${item.id}. ${item.message}`);
                      }
                      else
                      {
                        this.showInfo(`${item.id}. ${item.message}`);
                      }
                    })
    }
  }

  protected showError(detail: string, summary?: string): void
  {
    this._messageService.add({severity: 'error', summary: summary, detail: detail});
  }

  protected showSuccess(detail: string, summary?: string): void
  {
    this._messageService.add({severity: 'success', summary: summary, detail: detail});
  }

  protected showWarning(detail: string, summary?: string): void
  {
    this._messageService.add({severity: 'warn', summary: summary, detail: detail});
  }

  protected showInfo(detail: string, summary?: string): void
  {
    this._messageService.add({severity: 'info', summary: summary, detail: detail});
  }
}
