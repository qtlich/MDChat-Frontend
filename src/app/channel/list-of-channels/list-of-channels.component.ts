import {Component, OnInit}                  from '@angular/core';
import {GetChannelDescriptionResponseModel} from '../models/get.channel.description.response.model';
import {ChannelRestService}                 from '../../services/channels/channel.rest.service';
import {throwError}           from 'rxjs';
import {PostModel}            from '../../shared/post-model';
import {LazyLoadEvent}        from 'primeng/api';

@Component({
             selector:    'list-of-channels',
             templateUrl: './list-of-channels.component.html',
             styleUrls:   ['./list-of-channels.component.scss']
           })
export class ListOfChannelsComponent implements OnInit
{

  channelItems: Array<GetChannelDescriptionResponseModel>;
  posts: Array<PostModel>;

  constructor(private _channelService: ChannelRestService)
  {
  }

  ngOnInit()
  {
    this._channelService.getAllChannels().subscribe(data =>
                                                    {
                                                      this.channelItems = data;
                                                    }, error =>
                                                    {
                                                      throwError(error);
                                                    })
  }

  selectChannel(event, channel): void
  {
  }

  public loadChannelLazy(event: LazyLoadEvent): void
  {

  }
}
