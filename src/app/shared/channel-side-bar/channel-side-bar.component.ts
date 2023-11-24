import { Component, OnInit } from '@angular/core';
import { ChannelService } from '../../channel/channel.service';
import { ChannelResponseModel } from '../../channel/models/channel.response.model';

@Component({
  selector: 'channel-side-bar',
  templateUrl: './channel-side-bar.component.html',
  styleUrls: ['./channel-side-bar.component.css']
})
export class ChannelSideBarComponent implements OnInit {
  subreddits: Array<ChannelResponseModel> = [];
  displayViewAll: boolean;

  constructor(private channelService: ChannelService) {
    this.channelService.getAllChannels().subscribe(data => {
      if (data.length > 3) {
        this.subreddits = data.splice(0, 3);
        this.displayViewAll = true;
      } else {
        this.subreddits = data;
      }
    });
  }

  ngOnInit(): void { }

}
