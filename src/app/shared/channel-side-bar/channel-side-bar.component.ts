import {Component, OnInit}                  from '@angular/core';
import {GetChannelDescriptionResponseModel} from '../../channel/models/get.channel.description.response.model';
import {ChannelRestService}                 from '../../services/channels/channel.rest.service';

@Component({
             selector:    'channel-side-bar',
             templateUrl: './channel-side-bar.component.html',
             styleUrls:   ['./channel-side-bar.component.css']
           })
export class ChannelSideBarComponent implements OnInit
{
  channels: Array<GetChannelDescriptionResponseModel> = [];
  displayViewAll: boolean;

  constructor(private channelService: ChannelRestService)
  {
    this.channelService.getAllChannels().subscribe(data =>
                                                   {
                                                     if (data.length > 3)
                                                     {
                                                       this.channels = data.splice(0, 3);
                                                       this.displayViewAll = true;
                                                     }
                                                     else
                                                     {
                                                       this.channels = data;
                                                     }
                                                   });
  }

  ngOnInit(): void
  {
  }

}
