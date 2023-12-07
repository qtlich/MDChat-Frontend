import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Router} from '@angular/router';
import {ChannelService} from '../channel.service';
import {throwError} from 'rxjs';
import {MessageService} from "primeng/api";
import {CreateChannelDtoPayloadModel} from "./models/create-channel-dto-payload-model";
import {BaseComponent}                                  from '../../common/components/base.component/base.component';

@Component({
             selector: 'create-channel',
             templateUrl: './create-channel.component.html',
             styleUrls: ['./create-channel.component.css']

           })
export class CreateChannelComponent extends BaseComponent implements OnInit
{
  public readonly MAX_CHANNEL_NAME_LENGTH = 30;
  public remaining: number = this.MAX_CHANNEL_NAME_LENGTH;
  public channelName: string;
  public channelDescription: string;
  public channelType: string = "public";


  constructor(private router: Router,
              private channelService: ChannelService,
              messageService: MessageService)
  {
    super(messageService)
  }

  public onDiscardClick(): void
  {
    this.router.navigateByUrl('/');
  }

  public onCreateChannelClick(): void
  {
    if (this.__isValidData())
    {
      this.createChannel();
    }
  }

  public countRemaining(): void
  {
    this.remaining = this.MAX_CHANNEL_NAME_LENGTH - this.channelName.length;
  }

  private __isValidData(): boolean
  {
    if (!this.channelName || this.channelName.length == 0)
    {
      this.showWarning( 'Channel name is required');
      return false;
    }
    if (!this.channelDescription || this.channelDescription.length == 0)
    {
      this.showWarning(  'Channel description is required');
      return false;
    }
    return true;
  }

  discard()
  {
    this.router.navigateByUrl('/');
  }

  createChannel()
  {
    this.channelService.createChannel(this.__createPayload()).subscribe(data =>
                                                                        {
                                                                          if (data && data.id > 0)
                                                                          {
                                                                            this.showSuccess(`Channel: ${data.name} success created`,
                                                                                             'Success operation');
                                                                            this.goToChannelId(data.id);
                                                                          }
                                                                          else
                                                                          {
                                                                            this.showError(`Channel ${data.name} not created`);
                                                                          }
                                                                        }, error =>
                                                                        {
                                                                          this.showError(`Channel ${this.channelName} not created`);
                                                                        })
  }

  private goToChannelId(channelId: number): void
  {
    this.router.navigate([`view-channel/${channelId}`]);
  }

  private __createPayload(): CreateChannelDtoPayloadModel
  {
    return new CreateChannelDtoPayloadModel(null,
                                            this.channelName,
                                            this.channelDescription,
                                            this.__getChannelType(this.channelType));
  }

  private __getChannelType(type: string): number
  {
    switch (type)
    {
      case "public":
        return 0;
      case "restricted":
        return 1;
      case "private":
        return 2;
    }
  }
}
