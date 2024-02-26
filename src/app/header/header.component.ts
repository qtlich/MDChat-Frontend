import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Router}                                  from '@angular/router';
import {MenuItem, SelectItem}                    from 'primeng/api';
import {SlideMenu}                               from 'primeng/slidemenu/slidemenu';
import {AuthDataService}                         from '../auth/shared/auth.data.service';
import {SearchChannelsInputModel}                from '../channel/models/search-channels-input-model';
import {SearchChannelsResultModel}               from '../channel/models/search-channels-result-model';
import {BaseComponent}                           from '../common/components/base.component/base.component';
import {GlobalBusService}                        from '../common/services/global.bus.service';
import {ChannelRestService}                      from '../services/channels/channel.rest.service';
import {ThemeService}                            from '../services/theme.service';

enum EItems
{
  HOME           = -1,
  CREATE_POST    = -2,
  CREATE_CHANNEL = -3,
  SEARCH_RESULT  = -4,
  VIEW_PROFILE   = -5,
  USER_SETTINGS  = -6,
  NOT_SELECTED   = -10
}

@Component({
             selector:    'main-header',
             templateUrl: './header.component.html',
             styleUrls:   ['./header.component.css']
           })
export class HeaderComponent extends BaseComponent implements OnInit, OnDestroy
{
  @ViewChild('usermenu') userMenu: SlideMenu;
  public items: MenuItem[] = [{label: 'Profile', icon: 'pi pi-user', command: (event) => this.goToUserProfile()},
                              {label: 'User settings', icon: 'pi pi-cog', command: (event) => this.goToSettings()},
                              {label: 'Logout', icon: 'pi pi-sign-out', command: (event) => this.logout()}];
  public searchString: string;
  public filteredChannelsMultiple: SearchChannelsResultModel[];
  public channels: SearchChannelsResultModel[];
  public channelItems: Array<SelectItem> = [];
  public selectedChannel: EItems;
  private readonly channelDefaultItems: Array<SelectItem> = [{label: 'Home', value: EItems.HOME, icon: 'pi pi-home'},
                                                             {label: 'Create channel', value: EItems.CREATE_CHANNEL, icon: 'pi pi-plus'},
                                                             {label: 'Create post', value: EItems.CREATE_POST, icon: 'pi pi-plus'},
                                                             {label: 'Search Result', value: EItems.SEARCH_RESULT, icon: 'pi pi-search'},
                                                             {label: 'Profile', value: EItems.VIEW_PROFILE, icon: 'pi pi-user'},
                                                             {label: 'User settings', value: EItems.USER_SETTINGS, icon: 'pi pi-cog'},];

  constructor(private _router: Router,
              private _channelRestService: ChannelRestService,
              private _themeService: ThemeService,
              serviceBus: GlobalBusService,
              authService: AuthDataService)
  {
    super(serviceBus, authService);
  }

  public onUserMenuClick(event: any): void
  {
    this.userMenu && this.userMenu.toggle(event);
  }
  public onClickMDChat():void
  {
    this.selectedChannel = EItems.HOME;
  }
  public onKeyUp(event): void
  {
    console.log('onKeyUp=>', event);
  }

  public onClearAutoComplete(): void
  {
    this.__gotoHome();
  }

  public onSelectChannel(item: SearchChannelsResultModel): void
  {
    this.selectedChannel = EItems.SEARCH_RESULT;
    this._router.navigateByUrl(`/view-channel/${item.channelId}`);
  }

  public onSearch(event: KeyboardEvent): void
  {
    if(['Enter'].includes(event.key))
    {
      this.__search();
    }
  }

  public ngOnInit(): void
  {
    super.ngOnInit();
    this.__loadChannels();
  }

  public goToUserProfile(): void
  {
    this._router.navigateByUrl(`/user/${this.userName}`);
  }

  public logout(): void
  {
    this.userMenu.toggle(null);
    this.authService.logout();
    this._router.navigateByUrl('/');
  }

  public goToSettings(): void
  {
    this._router.navigateByUrl(`/settings`);
  }

  public filterChannelsMultiple(event: any): void
  {
    const channelMask = event.query;
    this._channelRestService
        .searchChannels(new SearchChannelsInputModel(null, channelMask))
        .subscribe((channelsFromServer: SearchChannelsResultModel[]) =>
                   {
                     this.filteredChannelsMultiple = this.__filterChannels(channelMask, channelsFromServer);
                   });
  }

  public onChangeChannel(value: number): void
  {
    switch(value)
    {
      case EItems.HOME:
        this.__gotoHome();
        break;
      case EItems.CREATE_CHANNEL:
        this._router.navigateByUrl('/create-channel');
        break;
      case EItems.CREATE_POST:
        this._router.navigateByUrl('/create-post');
        break;
      case EItems.VIEW_PROFILE:
        this.goToUserProfile();
        break;
      case EItems.USER_SETTINGS:
        this.goToSettings();
        break;
      case EItems.SEARCH_RESULT:
        this._router.navigateByUrl('/search-result');
        break;
      default:
        this._router.navigateByUrl(`/view-channel/${value}`);
        break;
    }
  }

  private __loadChannels(): void
  {
    this.channelItems = this.channelDefaultItems;
  }

  /**
   * Need for multiply
   * @param query
   * @param channels
   * @private
   */
  private __filterChannels(query: string, channels: SearchChannelsResultModel[]): any[]
  {
    const filtered: SearchChannelsResultModel[] = [];
    for(const channel of channels)
    {
      if(channel.channelName.toLowerCase().indexOf(query.toLowerCase()) != -1)
      {
        filtered.push(channel);
      }
    }
    return filtered;
  }

  private __gotoHome(): void
  {
    this.selectedChannel = EItems.HOME;
    this._router.navigateByUrl('/');
  }

  private __search(): void
  {
    this._channelRestService.searchChannels(new SearchChannelsInputModel(null, this.searchString))
        .subscribe((data: SearchChannelsResultModel[]) => console.log('Data=>', data));
    this.__selectSearch();
  }

  private __selectSearch(): void
  {
    this.selectedChannel = EItems.SEARCH_RESULT;
  }
}
