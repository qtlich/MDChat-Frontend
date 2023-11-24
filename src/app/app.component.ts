import {Component} from '@angular/core';
import {MessageService} from "primeng/api";

/**
 * set NODE_OPTIONS=--openssl-legacy-provider
 */
@Component({
             selector: 'app-root',
             templateUrl: './app.component.html',
             styleUrls: ['./app.component.css'],
             providers: [MessageService]
           })
export class AppComponent
{
  title = 'md-chat';
}
