import {Component, Input} from '@angular/core';
import {Router} from '@angular/router';
import {ChannelResponseModel} from '../models/channel.response.model';

@Component({
             selector   : 'channel-description-side-bar',
             templateUrl: './view-channel-description.component.html',
             styleUrls  : ['./view-channel-description.component.css']
           })
export class ViewChannelDescriptionComponent {
  @Input() channel: ChannelResponseModel;

  constructor(private router: Router) {
  }
}
