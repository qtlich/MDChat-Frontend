import {Component, OnDestroy, OnInit}                   from '@angular/core';
import {Router}                                         from '@angular/router';
import {BaseComponent}                                  from '../../common/components/base.component/base.component';
import {isEmptyArray, isEmptyStringField}               from '../../common/core/core.free.functions';
import {OPERATION_TYPES}                                from '../../common/core/enums/operation.types';
import {EActionType}                                    from '../../common/models/event.type';
import {GlobalBusService}                               from '../../common/services/global.bus.service';
import {ChannelDataService, OnSuccessModifyChannelItem} from '../../services/channels/channel.data.service';
import {ChannelCudRequestModel}                         from '../../services/channels/models/channel.cud.request.model';
import {CreateChannelScreenDataModel}                   from './models/create.channel.screen.data.model';

@Component({
             selector:    'create-channel',
             templateUrl: './create-channel.component.html',
             styleUrls:   ['./create-channel.component.css']

           })
export class CreateChannelComponent extends BaseComponent implements OnInit, OnDestroy
{
  public readonly MAX_CHANNEL_NAME_LENGTH = 50;
  public sD: CreateChannelScreenDataModel = new CreateChannelScreenDataModel();

  constructor(private _router: Router,
              private _channelService: ChannelDataService,
              serviceBus: GlobalBusService)
  {
    super(serviceBus);

  }

  public ngOnInit()
  {
    super.ngOnInit();
    this.countRemaining();
  }

  public onDiscardClick(): void
  {
    this._router.navigateByUrl('/');
  }

  public onCreateChannelClick(): void
  {
    if (this.__isValidData())
    {
      this.__createChannel();
    }
    else
    {
      this.serviceBus.showMessages(this.informationMessages);
    }
  }

  protected onSubscribeData()
  {
    super.onSubscribeData();
    this.subscribe(this.serviceBus.onEvent(EActionType.SUCCESS_MODIFY_CHANNEL, (data: OnSuccessModifyChannelItem) =>
    {
      if (data.item.operationType == OPERATION_TYPES.CREATE)
      {
        this.goToChannelId(data.item.channelId);
      }
    }));
  }

  public countRemaining(): void
  {
    this.sD.remaining = this.MAX_CHANNEL_NAME_LENGTH - (!isEmptyStringField(this.sD.channelName)? this.sD.channelName.length:0);
  }

  private __isValidData(): boolean
  {
    this.clearInformationMessages();
    let i: number;
    isEmptyStringField(this.sD.channelName) && this.addInformationMessage(--i, 'Channel name is required');
    isEmptyStringField(this.sD.channelDescription) && this.addInformationMessage(--i, 'Channel description is required');
    return isEmptyArray(this.informationMessages);
  }

  discard()
  {
    this._router.navigateByUrl('/');
  }

  private __createChannel()
  {
    this._channelService.channelCUD(this.__prepareDataForSave());
  }

  private __prepareDataForSave(): ChannelCudRequestModel
  {
    return new ChannelCudRequestModel(OPERATION_TYPES.CREATE,
                                      null,
                                      this.__getChannelType(this.sD.channelTypeString),
                                      !isEmptyStringField(this.sD.channelName) ? this.sD.channelName : null,
                                      !isEmptyStringField(this.sD.channelDescription) ? this.sD.channelDescription : null);
  }

  private goToChannelId(channelId: number): void
  {
    this._router.navigate([`view-channel/${channelId}`]);
  }

  private __getChannelType(type: string): number
  {
    switch (type)
    {
      case 'public':
        return 0;
      case 'restricted':
        return 1;
      case 'private':
        return 2;
    }
  }
}
