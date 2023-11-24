import { Component, OnInit } from '@angular/core';
import { ChannelResponseModel } from '../models/channel.response.model';
import { ChannelService } from '../channel.service';
import { throwError } from 'rxjs';
import {PostModel} from "../../shared/post-model";
import {LazyLoadEvent} from "primeng/api";

@Component({
  selector: 'list-of-channels',
  templateUrl: './list-of-channels.component.html',
  styleUrls: ['./list-of-channels.component.scss']
})
export class ListOfChannelsComponent implements OnInit {

  channelItems: Array<ChannelResponseModel>;
  posts: Array<PostModel>;
  constructor(private _channelService: ChannelService) {
  }

  ngOnInit() {
    this._channelService.getAllChannels().subscribe(data => {
      this.channelItems = data;
    }, error => {
      throwError(error);
    })
  }
  public loadChannelLazy(event:LazyLoadEvent):void
  {

  }
}
