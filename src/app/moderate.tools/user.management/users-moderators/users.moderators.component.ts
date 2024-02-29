import {Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {ConfirmationService}                                           from 'primeng-lts';
import {LazyLoadEvent}                                                 from 'primeng/primeng-lts';
import {AuthDataService}                                               from '../../../auth/shared/auth.data.service';
import {BaseSearchComponent}                                           from '../../../common/components/base.search.component/base.search.component';
import {executeIf, isChangedAndNotNullOrUndefined, isNullOrUndefined}  from '../../../common/core/core.free.functions';
import {FieldType}                                                     from '../../../common/core/table.columns.model';
import {EActionType}                                                   from '../../../common/models/event.type';
import {GlobalBusService}                                              from '../../../common/services/global.bus.service';
import {MANAGE_USER_PERMISSION_OPERATION_TYPES}                        from '../../../services/user.management/enums/manage.user.permission.operation.types.enum';
import {GetChannelModeratorUsersRequestModel}                          from '../../../services/user.management/models/get.channel.moderator.users.request.model';
import {GetChannelModeratorUsersResponseModel}                         from '../../../services/user.management/models/get.channel.moderator.users.response.model';
import {ManageUserChannelPermissionsRequestModel}                      from '../../../services/user.management/models/manage.user.channel.permissions.request.model';
import {OnManageUserChannelModeratorResult, UserManagementDataService} from '../../../services/user.management/user.management.data.service';
import {UsersModeratorsScreenDataModel}                                from './models/users.moderators.screen.data.model';

@Component({
             selector:    'moderators-users',
             templateUrl: './users.moderators.component.html',
             styleUrls:   ['./users.moderators.component.css'],
             providers:   [ConfirmationService]
           })
export class UsersModeratorsComponent extends BaseSearchComponent<GetChannelModeratorUsersRequestModel, GetChannelModeratorUsersResponseModel> implements OnInit, OnDestroy, OnChanges
{
  @Input() channelId: number;
  public sD: UsersModeratorsScreenDataModel = new UsersModeratorsScreenDataModel();

  constructor(private _dataService: UserManagementDataService,
              serviceBus: GlobalBusService,
              authService: AuthDataService)
  {
    super(serviceBus, authService);
    this.setTableColumns([{field: 'userName', header: 'Username', width: '8em', text_align: 'left', field_type: FieldType.TEXT, header_col_hint: 'Username'},
                          {field: 'authorName', header: 'Author', width: '10em', text_align: 'left', field_type: FieldType.TEXT, header_col_hint: 'Who made a moderato'},
                          {field: 'created', header: 'Moment', width: '8em', text_align: 'center', field_type: FieldType.TEXT, header_col_hint: 'Moment'}]);
  }

  public onAddModeratorClick(): void
  {
    this.sD.displayAddModeratorDialog = true;
  }

  public onManageUserClick(item: GetChannelModeratorUsersResponseModel): void
  {
    this.selectedItem = item;
    this.__manageUser();
  }

  public onRowSelect(item: GetChannelModeratorUsersResponseModel): void
  {
    this.selectedItem = item;
  }

  public onCloseDialog(): void
  {
    this.sD.displayAddModeratorDialog = false;
  }

  public ngOnChanges(changes: SimpleChanges)
  {
    executeIf(isChangedAndNotNullOrUndefined(changes, 'channelId'), () => this.load());
  }

  public loadUsersLazy(event: LazyLoadEvent)
  {
    this.load(event.first, event.rows);
  }
  protected onCreateContextMenu()
  {
    this.contextMenuItems = [{label: 'Unban user', icon: 'pi pi-trash', command: () => this.__manageUser()}];
  }

  protected loadData(item: GetChannelModeratorUsersRequestModel)
  {
    this._dataService.loadChannelModeratorUsers(item);
  }

  protected prepareDataForSearch(): GetChannelModeratorUsersRequestModel
  {
    return new GetChannelModeratorUsersRequestModel(this.channelId,
                                                 this.offset,
                                                 this.limit);
  }

  protected onSubscribeData(): void
  {
    super.onSubscribeData();
    this.subscribe(this._dataService.onLoadChannelModeratorUsersEvent().subscribe((data) =>this.items = data));
    this.subscribe(this._dataService.onLoadingEvent().subscribe((loading) => this.loading = loading));
    this.subscribe(this._dataService.onBlockButtonEvent().subscribe((blockButton) => this.blockButton = blockButton));
    this.subscribe(this.serviceBus.onEvent<OnManageUserChannelModeratorResult>(EActionType.ON_ADD_MODERATOR_USER_IN_CHANNEL_ACTION, (result: OnManageUserChannelModeratorResult) => result.success && this.load()));
  }

  protected isValidDataForRefresh()
  {
    let i: number = 0;
    isNullOrUndefined(this.channelId) && this.addInformationMessage(--i, `channelId can't be null`);
  }

  private __manageUser(): void
  {

    this._dataService.manageUserChannelPermissions(new ManageUserChannelPermissionsRequestModel(MANAGE_USER_PERMISSION_OPERATION_TYPES.CREATE_DELETE_MODERATOR,
                                                                                         !isNullOrUndefined(this.selectedItem.userId)?this.selectedItem.userId:null,
                                                                                         !isNullOrUndefined(this.selectedItem.channelId)?this.selectedItem.channelId:null,
                                                                                         !isNullOrUndefined(this.selectedItem.isAdministrator)?this.selectedItem.isAdministrator:null,
                                                                                         !isNullOrUndefined(this.selectedItem.isChannelModerator)?this.selectedItem.isChannelModerator:false,
                                                                                         !isNullOrUndefined(this.selectedItem.canViewChannel)?this.selectedItem.canViewChannel:false,
                                                                                         !isNullOrUndefined(this.selectedItem.canViewPosts)?this.selectedItem.canViewPosts:false,
                                                                                         !isNullOrUndefined(this.selectedItem.canCreatePosts)?this.selectedItem.canCreatePosts:false,
                                                                                         !isNullOrUndefined(this.selectedItem.canComment)?this.selectedItem.canComment:false,
                                                                                         !isNullOrUndefined(this.selectedItem.canVote)?this.selectedItem.canVote:false));
  }
}
