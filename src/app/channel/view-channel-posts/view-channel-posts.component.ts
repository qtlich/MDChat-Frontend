import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {ChannelResponseModel} from '../models/channel.response.model';
import {ChannelService} from '../channel.service';
import {Subscription, throwError} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {PostService} from '../../shared/post.service';
import {PostModel} from '../../shared/post-model';

@Component({
             selector: 'view-channel-posts',
             templateUrl: './view-channel-posts.component.html',
             styleUrls: ['./view-channel-posts.component.css']
           })
export class ViewChannelPostsComponent implements OnInit, OnDestroy
{

  channelId: number;
  channel: ChannelResponseModel;
  channelPosts: PostModel[];
  subscription: Subscription;

  constructor(private channelService: ChannelService,
              private postService: PostService,
              private _aR: ActivatedRoute)
  {
    this.subscription = this._aR.params.subscribe(params =>
                                                  {
                                                    this.channelId = params['id'];
                                                    this.loadChannelContent();
                                                  });
  }

  ngOnInit()
  {

  }

  loadChannelContent(): void
  {
    this.channelService.getChannel(this.channelId).subscribe(data =>
                                                             {
                                                               this.channel = data;
                                                             }, error =>
                                                             {
                                                               throwError(error);
                                                             });
    this.postService.getPostsByChannel(this.channelId).subscribe(data =>
                                                                 {
                                                                   this.channelPosts = data;
                                                                   console.log('Channel posts', this.channelPosts);
                                                                 },
                                                                 error =>
                                                                 {
                                                                   throwError(error);
                                                                 });
  }

  public ngOnDestroy()
  {
    this.subscription.unsubscribe();
  }
}
