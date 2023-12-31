import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {ChannelResponseModel} from '../models/channel.response.model';
import {ChannelService} from '../channel.service';
import {Subscription, throwError} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {PostService} from '../../shared/post.service';
import {PostModel} from '../../shared/post-model';

@Component({
             selector: 'view-channel',
             templateUrl: './view-channel.component.html',
             styleUrls: ['./view-channel.component.css']
           })
export class ViewChannelComponent implements OnInit, OnDestroy
{

  @Input() channelId: number;
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
  public refreshChannel(id:number):void
  {
    this.postService.getPostsByChannel(id).subscribe(data =>
                                                                 {
                                                                   this.channelPosts = data;
                                                                   console.log('Channel posts', this.channelPosts);
                                                                 },
                                                                 error =>
                                                                 {
                                                                   throwError(error);
                                                                 });
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
    this.refreshChannel(this.channelId)

  }

  public ngOnDestroy()
  {
    this.subscription.unsubscribe();
  }
}
