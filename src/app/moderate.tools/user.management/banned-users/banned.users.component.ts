import {Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {ConfirmationService}                                           from 'primeng-lts';
import {LazyLoadEvent}                                                 from 'primeng/primeng-lts';
import {AuthDataService}                                               from '../../../auth/shared/auth.data.service';
import {BaseSearchComponent}                                           from '../../../common/components/base.search.component/base.search.component';
import {executeIf, isChangedAndNotNullOrUndefined, isNullOrUndefined}  from '../../../common/core/core.free.functions';
import {FieldType}                                                     from '../../../common/core/table.columns.model';
import {EActionType}                                                   from '../../../common/models/event.type';
import {GlobalBusService}                                              from '../../../common/services/global.bus.service';
import {GetChannelBannedUsersRequestModel}                             from '../../../services/user.management/models/get.channel.banned.users.request.model';
import {GetChannelBannedUsersResponseModel}                            from '../../../services/user.management/models/get.channel.banned.users.response.model';
import {ManageUserChannelBanningRequestModel}                          from '../../../services/user.management/models/manage.user.channel.banning.request.model';
import {OnManageUserChannelBanningResult, UserManagementDataService}   from '../../../services/user.management/user.management.data.service';
import {BannedUsersScreenDataModel}                                    from './models/banned.users.screen.data.model';

@Component({
             selector:    'banned-users',
             templateUrl: './banned.users.component.html',
             styleUrls:   ['./banned.users.component.css'],
             providers:   [ConfirmationService]
           })
export class BannedUsersComponent extends BaseSearchComponent<GetChannelBannedUsersRequestModel, GetChannelBannedUsersResponseModel> implements OnInit, OnDestroy, OnChanges
{
  @Input() channelId: number;
  public sD: BannedUsersScreenDataModel = new BannedUsersScreenDataModel();

  constructor(private _dataService: UserManagementDataService,
              serviceBus: GlobalBusService,
              authService: AuthDataService)
  {
    super(serviceBus, authService);
    this.setTableColumns([{field: 'userName', header: 'Username', width: '8em', text_align: 'left', field_type: FieldType.TEXT, header_col_hint: 'Username'},
                          {field: 'banReasonName', header: 'Ban reason', width: '20em', text_align: 'left', field_type: FieldType.TEXT, header_col_hint: 'Ban reason'},
                          {field: 'note', header: 'Note', width: '20em', text_align: 'left', field_type: FieldType.TEXT, header_col_hint: 'Note'},
                          {field: 'permanentBanned', header: 'Permanent', width: '8em', text_align: 'center', field_type: FieldType.YES_NO, header_col_hint: 'Banned permanent'},
                          {field: 'daysBanned', header: 'Days', width: '7em', text_align: 'right', field_type: FieldType.INTEGER, header_col_hint: 'Banned days'},
                          {field: 'authorName', header: 'Who banned', width: '10em', text_align: 'left', field_type: FieldType.TEXT, header_col_hint: 'Who ban user'},
                          {field: 'created', header: 'Moment', width: '8em', text_align: 'center', field_type: FieldType.TEXT, header_col_hint: 'Moment ban'}]);
  }

  public onBanUserClick(): void
  {
    this.sD.displayBanDialog = true;
  }

  public onManageUserClick(item: GetChannelBannedUsersResponseModel): void
  {
    this.selectedItem = item;
    this.__manageUser();
  }

  public onRowSelect(item: GetChannelBannedUsersResponseModel): void
  {
    this.selectedItem = item;
  }

  public onCloseDialog(): void
  {
    this.sD.displayBanDialog = false;
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

  protected loadData(item: GetChannelBannedUsersRequestModel)
  {
    this._dataService.loadChannelBannedUsers(item);
  }

  protected prepareDataForSearch(): GetChannelBannedUsersRequestModel
  {
    return new GetChannelBannedUsersRequestModel(this.channelId,
                                                 this.offset,
                                                 this.limit);
  }

  protected onSubscribeData(): void
  {
    super.onSubscribeData();
    this.subscribe(this._dataService.onLoadChannelBannedUsersEvent().subscribe((data) =>this.items = data));
    this.subscribe(this._dataService.onLoadingEvent().subscribe((loading) => this.loading = loading));
    this.subscribe(this._dataService.onBlockButtonEvent().subscribe((blockButton) => this.blockButton = blockButton));
    this.subscribe(this.serviceBus.onEvent<OnManageUserChannelBanningResult>(EActionType.ON_BAN_USER_IN_CHANNEL_ACTION, (result: OnManageUserChannelBanningResult) => result.success && this.load()));
  }

  protected isValidDataForRefresh()
  {
    let i: number = 0;
    isNullOrUndefined(this.channelId) && this.addInformationMessage(--i, `channelId can't be null`);
  }

  private __manageUser(): void
  {
    console.log('this.selectedItem=>', this.selectedItem);
    this._dataService.manageUserChannelBanning(new ManageUserChannelBanningRequestModel(this.selectedItem.userId,
                                                                                        this.selectedItem.channelId,
                                                                                        this.selectedItem.banReasonId,
                                                                                        null,
                                                                                        null,
                                                                                        this.selectedItem.permanentBanned));
  }
}
