import {Component, Input, OnDestroy, OnInit} from "@angular/core";
import {ChannelResponseModel} from "../models/channel.response.model";
import {ChannelService} from "../channel.service";
import {Subscription, throwError} from "rxjs";
import {ActivatedRoute} from "@angular/router";

@Component({
             selector: 'view-channel',
             templateUrl: './view-channel.component.html',
             styleUrls: ['./view-channel.component.css']
           })
export class ViewChannelComponent implements OnInit, OnDestroy
{

  @Input() channelId: number;
  channel: ChannelResponseModel;
  subscription: Subscription;

  constructor(private channelService: ChannelService,
              private _aR: ActivatedRoute)
  {
    this.subscription = this._aR.params.subscribe(params =>
                                                  {
                                                    this.channelId = params["id"];
                                                    this.loadChannelContent();
                                                  });
  }

  ngOnInit()
  {

  }

  loadChannelContent():void
  {
    this.channelService.getChannel(this.channelId).subscribe(data =>
                                                          {
                                                            this.channel = data;
                                                          }, error =>
                                                          {
                                                            throwError(error);
                                                          });
  }
  public ngOnDestroy()
  {
    this.subscription.unsubscribe();
  }
}
