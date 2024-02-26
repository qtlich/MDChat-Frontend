import {Component, Input}    from '@angular/core';
import {ConfirmationService} from 'primeng-lts';

@Component({
             selector:    'channel-state',
             templateUrl: './channel.state.component.html',
             styleUrls:   ['./channel.state.component.css'],
             providers:   [ConfirmationService]
           })
export class ChannelStateComponent
{
  @Input() channelTypeId:number = -1;
  constructor()
  {
  }
}
