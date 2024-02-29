import {Component, Input, OnDestroy, OnInit}                         from '@angular/core';
import {AuthDataService}                                             from '../../../../auth/shared/auth.data.service';
import {BaseDialogComponent}                                         from '../../../../common/components/base.dialog.component/base.dialog.component';
import {isEmptyArray, isNullOrUndefined}                             from '../../../../common/core/core.free.functions';
import {GlobalBusService}                                            from '../../../../common/services/global.bus.service';
import {MANAGE_USER_PERMISSION_OPERATION_TYPES}                      from '../../../../services/user.management/enums/manage.user.permission.operation.types.enum';
import {GetIsUserBannedInChannelRequestModel}                        from '../../../../services/user.management/models/get.is.user.banned.in.channel.request.model';
import {GetIsUserBannedInChannelResponseModel}                       from '../../../../services/user.management/models/get.is.user.banned.in.channel.response.model';
import {GetIsUserModeratorInChannelRequestModel}                     from '../../../../services/user.management/models/get.is.user.moderator.in.channel.request.model';
import {GetIsUserModeratorInChannelResponseModel}                    from '../../../../services/user.management/models/get.is.user.moderator.in.channel.response.model';
import {ManageUserChannelPermissionsRequestModel}                    from '../../../../services/user.management/models/manage.user.channel.permissions.request.model';
import {SearchUsersRequestModel}                                     from '../../../../services/user.management/models/search.users.request.model';
import {SearchUsersResponseModel}                                    from '../../../../services/user.management/models/search.users.response.model';
import {OnManageUserChannelBanningResult, UserManagementDataService} from '../../../../services/user.management/user.management.data.service';
import {AddModeratorDialogScreenDataModel}                           from './models/add.moderator.dialog.screen.data.model';

@Component({
             selector:    'add-moderator-dialog',
             templateUrl: './add.moderator.dialog.component.html',
             styleUrls:   ['./add.moderator.dialog.component.css']
           })
export class AddModeratorDialogComponent extends BaseDialogComponent implements OnInit, OnDestroy
{
  @Input() channelId: number;
  public sD: AddModeratorDialogScreenDataModel = new AddModeratorDialogScreenDataModel();

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

  public onAddModeratorClick(): void
  {
    if(this.__isValidData())
    {
      this._userManagementService.manageUserChannelPermissions(this.__prepareDataForSave())
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
    this._userManagementService.searchUsers(new SearchUsersRequestModel(value));
  }

  public onSelectUser(item: SearchUsersResponseModel): void
  {
    this.sD.userId = item.id;
    this.__checkUserIsModerator();
  }

  private __checkUserIsModerator(): void
  {
    this._userManagementService.checkIsUserModeratorInChannel(new GetIsUserModeratorInChannelRequestModel(this.sD.userId, this.channelId));
  }

  public onClearUser(): void
  {
    this.sD.userId = null;
  }

  public onChangePermanent(): void
  {
  }

  protected onSubscribeData(): void
  {
    super.onSubscribeData();
    this.subscribe(this._userManagementService.onManageUserBanningEvent().subscribe((result: OnManageUserChannelBanningResult) => result.success && this.closeForm()));
    this.subscribe(this._userManagementService.onSearchUsersEvent().subscribe((data: SearchUsersResponseModel[]) => this.sD.filteredUsersFromServer = data));
    this.subscribe(this._userManagementService.onLoadIsUserModeratorInChannelEvent().subscribe((result: GetIsUserModeratorInChannelResponseModel) => this.blockButton = result.isModerator));
  }

  private __isValidData(): boolean
  {
    this.clearInformationMessages();
    let i: number = 0;
    isNullOrUndefined(this.sD.channelId) && this.addInformationMessage(--i, `Channel not selected`);
    isNullOrUndefined(this.sD.userId) && this.addInformationMessage(--i, `Please select user`);
    return isEmptyArray(this.informationMessages);
  }

  private __clear(): void
  {
    this.sD.userId = null;
    this.sD.selectedUser = null;
  }

  private __prepareDataForSave(): ManageUserChannelPermissionsRequestModel
  {
    return new ManageUserChannelPermissionsRequestModel(MANAGE_USER_PERMISSION_OPERATION_TYPES.CREATE_DELETE_MODERATOR,
                                                        !isNullOrUndefined(this.sD.userId) ? this.sD.userId : null,
                                                        !isNullOrUndefined(this.sD.channelId) ? this.sD.channelId : null,
                                                        !isNullOrUndefined(this.sD.isAdministrator) ? this.sD.isAdministrator : false,
                                                        !isNullOrUndefined(this.sD.isChannelModerator) ? this.sD.isChannelModerator : false,
                                                        !isNullOrUndefined(this.sD.canViewChannel) ? this.sD.canViewChannel : false,
                                                        !isNullOrUndefined(this.sD.canViewPosts) ? this.sD.canViewPosts : false,
                                                        !isNullOrUndefined(this.sD.canCreatePosts) ? this.sD.canCreatePosts : false,
                                                        !isNullOrUndefined(this.sD.canComment) ? this.sD.canComment : false,
                                                        !isNullOrUndefined(this.sD.canVote) ? this.sD.canVote : false);
  }
}
