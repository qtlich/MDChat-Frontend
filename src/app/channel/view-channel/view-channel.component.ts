import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute}                      from '@angular/router';
import {BaseComponent}                       from '../../common/components/base.component/base.component';
import {errorToText, toNumber}               from '../../common/core/core.free.functions';
import {GlobalBusService}                    from '../../common/services/global.bus.service';
import {ChannelDataService}                  from '../../services/channels/channel.data.service';
import {PostDataService}                     from '../../services/posts/post.data.service';
import {PostModel}                           from '../../shared/post-model';
import {GetChannelDescriptionRequestModel}   from '../models/get.channel.description.request.model';
import {GetChannelDescriptionResponseModel}  from '../models/get.channel.description.response.model';

@Component({
             selector:    'view-channel',
             templateUrl: './view-channel.component.html',
             styleUrls:   ['./view-channel.component.css']
           })
export class ViewChannelComponent extends BaseComponent implements OnInit, OnDestroy
{
  @Input() channelId: number;
  public channel: GetChannelDescriptionResponseModel;
  channelPosts: PostModel[];

  constructor(private channelService: ChannelDataService,
              private postService: PostDataService,
              private _aR: ActivatedRoute,
              serviceBus: GlobalBusService)
  {
    super(serviceBus);
  }

  protected onSubscribeData()
  {
    super.onSubscribeData();
    this.subscribe(this._aR.params.subscribe(params =>
                                             {
                                               this.channelId = toNumber(params['id']);
                                               this.__loadChannelData();
                                             }));
    this.subscribe(this.channelService.onLoadChannelDescriptionEvent().subscribe((data: GetChannelDescriptionResponseModel) => this.channel = data));
  }

  public refreshChannel(id: number): void
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

  private __loadChannelData(): void
  {
    this.channelService.getChannelDescription(new GetChannelDescriptionRequestModel(this.channelId))
    this.refreshChannel(this.channelId)
  }
}
