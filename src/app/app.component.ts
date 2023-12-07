import {Component, OnInit} from '@angular/core';
import {MessageService} from "primeng/api";
import {ThemeService} from './services/theme.service';

/**
 * need execute in cmd as administrator
 * set NODE_OPTIONS=--openssl-legacy-provider
 */
@Component({
             selector: 'app-root',
             templateUrl: './app.component.html',
             styleUrls: ['./app.component.css'],
             providers: [MessageService]
           })
export class AppComponent implements OnInit
{
  title = 'MDChat';
  constructor(private _messageService: MessageService)
  {
  }

  public ngOnInit()
  {
    this._messageService.add({severity:'Warn',detail:'hi'});
  }

}
