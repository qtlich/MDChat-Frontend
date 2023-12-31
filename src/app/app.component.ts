import {Component, OnInit} from '@angular/core';
import {MessageService}    from 'primeng/api';

/**
 * need execute in cmd as administrator
 * set NODE_OPTIONS=--openssl-legacy-provider
 */
@Component({
             selector:    'app-root',
             templateUrl: './app.component.html',
             styleUrls:   ['./app.component.css'],
             providers:   [MessageService]
           })
export class AppComponent implements OnInit
{
  title = 'MDChat';

  constructor(messageService: MessageService)
  {
  }

  public ngOnInit()
  {
  }
}
