import {Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges}                                  from '@angular/core';
import {Router}                                                                                         from '@angular/router';
import {GetChannelDescriptionRequestModel}                                                              from '../../../channel/models/get.channel.description.request.model';
import {GetChannelDescriptionResponseModel}                                                             from '../../../channel/models/get.channel.description.response.model';
import {BaseComponent}                                                                                  from '../../../common/components/base.component/base.component';
import {executeIf, isChangedAndNotNullOrUndefined, isEmptyArray, isEmptyStringField, isNullOrUndefined} from '../../../common/core/core.free.functions';
import {OPERATION_TYPES}                                                                                from '../../../common/core/enums/operation.types';
import {EActionType}                                                                                    from '../../../common/models/event.type';
import {GlobalBusService}                                                                               from '../../../common/services/global.bus.service';
import {ChannelDataService, OnSuccessModifyChannelItem}                                                 from '../../../services/channels/channel.data.service';
import {ChannelCudRequestModel}                                                                         from '../../../services/channels/models/channel.cud.request.model';
import {EditChannelScreenDataModel}                                                                     from './models/edit.channel.screen.data.model';

@Component({
             selector:    'edit-channel',
             templateUrl: './edit.channel.component.html',
             styleUrls:   ['./edit.channel.component.css']
           })
export class EditChannelComponent extends BaseComponent implements OnInit, OnDestroy, OnChanges
{
  public readonly MAX_CHANNEL_NAME_LENGTH = 50;
  @Input() channelId: number;
  public sD: EditChannelScreenDataModel = new EditChannelScreenDataModel();

  constructor(private _router: Router,
              private _channelService: ChannelDataService,
              serviceBus: GlobalBusService)
  {
    super(serviceBus);
  }

  public ngOnChanges(changes: SimpleChanges)
  {
    executeIf(isChangedAndNotNullOrUndefined(changes, 'channelId'), () => this.__loadChannelDescription());
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

  public onModifyChannelClick(): void
  {
    if(this.__isValidData())
    {
      this.__ModifyChannel();
    }
    else
    {
      this.serviceBus.showMessages(this.informationMessages);
    }
  }

  public countRemaining(): void
  {
    this.sD.remaining = this.MAX_CHANNEL_NAME_LENGTH - (!isEmptyStringField(this.sD.channelName) ? this.sD.channelName.length : 0);
  }

  discard()
  {
    this._router.navigateByUrl('/');
  }

  protected onSubscribeData(): void
  {
    super.onSubscribeData();
    this.subscribe(this.serviceBus.onEvent(EActionType.SUCCESS_MODIFY_CHANNEL, (data: OnSuccessModifyChannelItem) =>
    {
      if(data.success)
      {
        this.__loadChannelDescription();
      }
    }));
    this.subscribe(this._channelService.onLoadChannelDescriptionEvent().subscribe((data: GetChannelDescriptionResponseModel) =>
                                                                                  {
                                                                                    this.sD.channelId = data.channelId;
                                                                                    this.sD.channelTypeString = this.__getChannelTypeString(data.channelType);
                                                                                    this.sD.channelName = data.channelName;
                                                                                    this.sD.channelDescription = data.channelDescription;
                                                                                  }));
  }

  private __loadChannelDescription(): void
  {
    this._channelService.getChannelDescription(new GetChannelDescriptionRequestModel(this.channelId));
  }

  private __isValidData(): boolean
  {
    this.clearInformationMessages();
    let i: number = 0;
    isNullOrUndefined(this.channelId) && this.addInformationMessage(--i, 'Channel is null');
    isEmptyStringField(this.sD.channelName) && this.addInformationMessage(--i, 'Channel name is required');
    isEmptyStringField(this.sD.channelDescription) && this.addInformationMessage(--i, 'Channel description is required');
    return isEmptyArray(this.informationMessages);
  }

  private __ModifyChannel()
  {
    this._channelService.channelCUD(this.__prepareDataForSave());
  }

  private __prepareDataForSave(): ChannelCudRequestModel
  {
    return new ChannelCudRequestModel(OPERATION_TYPES.UPDATE,
                                      !isNullOrUndefined(this.channelId) ? this.channelId : null,
                                      this.__getChannelType(this.sD.channelTypeString),
                                      !isEmptyStringField(this.sD.channelName) ? this.sD.channelName : null,
                                      !isEmptyStringField(this.sD.channelDescription) ? this.sD.channelDescription : null);
  }

  private __getChannelType(type: string): number
  {
    switch(type)
    {
      case 'public':
        return 0;
      case 'restricted':
        return 1;
      case 'private':
        return 2;
    }
  }

  private __getChannelTypeString(type: number): string
  {
    switch(type)
    {
      case 0:
        return 'public';
      case 1:
        return 'restricted';
      case 2:
        return 'private';
    }
  }
}
