import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {BaseComponent}                       from '../../common/components/base.component/base.component';
import {errorToText}                         from '../../common/core/core.free.functions';
import {GlobalBusService}                    from '../../common/services/global.bus.service';
import {ChannelResponseModel}     from '../models/channel.response.model';
import {ChannelRestService}       from '../../services/channels/channel.rest.service';
import {Subscription, throwError} from 'rxjs';
import {ActivatedRoute}  from '@angular/router';
import {PostDataService} from '../../services/posts/post.data.service';
import {PostModel}       from '../../shared/post-model';

@Component({
             selector: 'view-channel',
             templateUrl: './view-channel.component.html',
             styleUrls: ['./view-channel.component.css']
           })
export class ViewChannelComponent extends BaseComponent implements OnInit, OnDestroy
{

  @Input() channelId: number;
  channel: ChannelResponseModel;
  channelPosts: PostModel[];
  subscription: Subscription;

  constructor(private channelService: ChannelRestService,
              private postService: PostDataService,
              private _aR: ActivatedRoute,
              serviceBus:GlobalBusService)
  {
    super(serviceBus);
    this.subscription = this._aR.params.subscribe(params =>
                                                  {
                                                    this.channelId = params['id'];
                                                    this.loadChannelContent();
                                                  });
  }

  public refreshChannel(id:number):void
  {
    this.postService.getPostsByChannel(id).subscribe(data =>
                                                                 {
                                                                   this.channelPosts = data;
                                                                 },
                                                                 error =>
                                                                 {
                                                                   this.showError(errorToText(error));
                                                                 });
  }
  loadChannelContent(): void
  {
    this.channelService.getChannel(this.channelId).subscribe(data =>
                                                             {
                                                               this.channel = data;
                                                             }, error =>
                                                             {
                                                               this.showError(errorToText(error));
                                                             });
    this.refreshChannel(this.channelId)

  }

  public ngOnDestroy()
  {
    this.subscription.unsubscribe();
  }
}
