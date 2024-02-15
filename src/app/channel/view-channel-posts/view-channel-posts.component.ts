import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute}               from '@angular/router';
import {Subscription}                 from 'rxjs';
import {BaseComponent}    from '../../common/components/base.component/base.component';
import {errorToText}      from '../../common/core/core.free.functions';
import {GlobalBusService} from '../../common/services/global.bus.service';
import {PostModel}       from '../../shared/post-model';
import {PostDataService}      from '../../services/posts/post.data.service';
import {ChannelRestService}   from '../../services/channels/channel.rest.service';
import {ChannelResponseModel} from '../models/channel.response.model';

@Component({
             selector:    'view-channel-posts',
             templateUrl: './view-channel-posts.component.html',
             styleUrls:   ['./view-channel-posts.component.css']
           })
export class ViewChannelPostsComponent extends BaseComponent implements OnInit, OnDestroy
{

  channelId: number;
  channel: ChannelResponseModel;
  channelPosts: PostModel[];
  subscription: Subscription;

  constructor(private channelService: ChannelRestService,
              private postService: PostDataService,
              private _activeRoute: ActivatedRoute,
              serviceBus: GlobalBusService)
  {
    super(serviceBus);
  }

  protected onSubscribeData()
  {
    super.onSubscribeData();
    this.subscribe(this.subscription = this._activeRoute.params.subscribe(params =>
                                                                          {
                                                                            this.channelId = params['id'];
                                                                            this.__loadChannelContent();
                                                                          }))
  }

  private __loadChannelContent(): void
  {
    this.channelService.getChannel(this.channelId).subscribe(data => this.channel = data,
                                                             error => this.showError(errorToText(error)));
    this.postService.getPostsByChannel(this.channelId).subscribe(data => this.channelPosts = data,
                                                                 error => this.showError(errorToText(error)));
  }

}
