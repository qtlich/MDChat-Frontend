import {Component, Input, OnDestroy, OnInit}                                     from '@angular/core';
import {SelectItem}                                                              from 'primeng-lts';
import {AuthDataService}                                                         from '../../../../auth/shared/auth.data.service';
import {BaseDialogComponent}                                                     from '../../../../common/components/base.dialog.component/base.dialog.component';
import {isEmptyArray, isEmptyNumberField, isEmptyStringField, isNullOrUndefined} from '../../../../common/core/core.free.functions';
import {GlobalBusService}                                                        from '../../../../common/services/global.bus.service';
import {GetIsUserBannedInChannelRequestModel}                                    from '../../../../services/user.management/models/get.is.user.banned.in.channel.request.model';
import {GetIsUserBannedInChannelResponseModel}                                   from '../../../../services/user.management/models/get.is.user.banned.in.channel.response.model';
import {ManageUserChannelBanningRequestModel}                                    from '../../../../services/user.management/models/manage.user.channel.banning.request.model';
import {SearchUsersRequestModel}                                                 from '../../../../services/user.management/models/search.users.request.model';
import {SearchUsersResponseModel}                                                from '../../../../services/user.management/models/search.users.response.model';
import {OnManageUserChannelBanningResult, UserManagementDataService}             from '../../../../services/user.management/user.management.data.service';
import {BanUserDialogScreenDataModel}                                            from './models/ban.user.dialog.screen.data.model';

@Component({
             selector:    'ban-user-dialog',
             templateUrl: './ban.user.dialog.component.html',
             styleUrls:   ['./ban.user.dialog.component.css']
           })
export class BanUserDialogComponent extends BaseDialogComponent implements OnInit, OnDestroy
{
  @Input() channelId: number;
  public sD: BanUserDialogScreenDataModel = new BanUserDialogScreenDataModel();

  constructor(private _userManagementService: UserManagementDataService,
              serviceBus: GlobalBusService,
              authService: AuthDataService)
  {
    super(serviceBus, authService);
    this.__clear();
  }

  public onDiscardClick(): void
  {
    this.closeForm();
  }

  public onBanUserClick(): void
  {
    if(this.__isValidData())
    {
      this._userManagementService.manageUserChannelBanning(this.__prepareDataForSave())
    }
    else
    {
      this.serviceBus.showMessages(this.informationMessages);
    }
  }

  public ngOnInit()
  {
    super.ngOnInit();
    this.sD.channelId = this.channelId;
  }

  public filterUsers(value: string): void
  {
    console.log('VALUE=>', value);
    this._userManagementService.searchUsers(new SearchUsersRequestModel(value));
  }

  public onSelectUser(item: SearchUsersResponseModel): void
  {
    this.sD.userId = item.id;
    this.__checkUserBan();
  }

  private __checkUserBan(): void
  {
    this._userManagementService.checkIsUserBannedInChannel(new GetIsUserBannedInChannelRequestModel(this.sD.userId, this.channelId));
  }

  public onClearUser(): void
  {
    this.sD.userId = null;
  }

  public onChangePermanent(): void
  {
    if(this.sD.permanentBanned)
    {
      this.sD.daysBanned = 0;
    }
  }

  protected onSubscribeData(): void
  {
    super.onSubscribeData();
    this.subscribe(this._userManagementService.onManageUserBanningEvent().subscribe((result: OnManageUserChannelBanningResult) => result.success && this.closeForm()));
    this.subscribe(this._userManagementService.onSearchUsersEvent().subscribe((data: SearchUsersResponseModel[]) => this.sD.filteredUsersFromServer = data));
    this.subscribe(this._userManagementService.onLoadBanReasonsSIEvent().subscribe((data: SelectItem[]) => this.sD.banReasonsDD = data));
    this.subscribe(this._userManagementService.onLoadIsUserBannedInChannelEvent().subscribe((result: GetIsUserBannedInChannelResponseModel) => this.blockButton = result.isBanned));
  }

  private __isValidData(): boolean
  {
    this.clearInformationMessages();
    let i: number = 0;
    isNullOrUndefined(this.sD.channelId) && this.addInformationMessage(--i, `Channel not selected`);
    isNullOrUndefined(this.sD.userId) && this.addInformationMessage(--i, `Please select user`);
    isNullOrUndefined(this.sD.banReasonId) && this.addInformationMessage(--i, `Please select reason for ban`);
    isNullOrUndefined(this.sD.permanentBanned) && (isEmptyNumberField(this.sD.daysBanned) || this.sD.daysBanned == 0) && this.addInformationMessage(--i, `Please select how long ban`);
    this.sD.permanentBanned == false && (isEmptyNumberField(this.sD.daysBanned) || this.sD.daysBanned == 0) && this.addInformationMessage(--i, `Please choose how long is banning`);
    return isEmptyArray(this.informationMessages);
  }

  private __clear(): void
  {
    this.sD.userId = null;
    this.sD.selectedUser = null;
    this.sD.banReasonId = null;
    this.sD.note = null;
    this.sD.daysBanned = null;
    this.sD.permanentBanned = false;
  }

  private __prepareDataForSave(): ManageUserChannelBanningRequestModel
  {
    return new ManageUserChannelBanningRequestModel(!isNullOrUndefined(this.sD.userId) ? this.sD.userId : null,
                                                    !isNullOrUndefined(this.sD.channelId) ? this.sD.channelId : null,
                                                    !isNullOrUndefined(this.sD.banReasonId) ? this.sD.banReasonId : null,
                                                    !isEmptyStringField(this.sD.note) ? this.sD.note : null,
                                                    this.sD.permanentBanned == false && !isEmptyNumberField(this.sD.daysBanned) ? this.sD.daysBanned : null,
                                                    !isNullOrUndefined(this.sD.permanentBanned) ? this.sD.permanentBanned : false);
  }
}
