import {Component, OnInit, ViewChild} from '@angular/core';
import {AuthService} from '../auth/shared/auth.service';
import {Router} from '@angular/router';
import {ChannelService} from '../channel/channel.service';
import {MenuItem, SelectItem} from 'primeng/api';
import {ChannelResponseModel} from '../channel/models/channel.response.model';
import {SearchChannelsInputModel} from '../channel/models/search-channels-input-model';
import {SearchChannelsResultModel} from '../channel/models/search-channels-result-model';
import {ThemeItem, themes, ThemeService} from '../services/theme.service';
import {SlideMenu} from 'primeng/slidemenu/slidemenu';

enum EItems {
  HOME = -1,
  CREATE_POST = -2,
  CREATE_CHANNEL = -3,
  SEARCH_RESULT = -4,
  VIEW_PROFILE = -5,
  PEFERENCES = -6
}

@Component({
  selector: 'main-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @ViewChild('usermenu') userMenu: SlideMenu;
  public themes: ThemeItem[] = themes;
  public items: MenuItem[] = [{label: 'View Profile', icon: 'pi pi-user-edit', command: (event) => this.goToUserProfile()},
    {label: 'Settings', icon: 'pi pi-sliders-v', command: (event) => this.goToSettings()},
    {label: 'Logout', icon: 'pi pi-sign-out', command: (event) => this.logout()}];
  public isLoggedIn: boolean;
  public username: string;
  public searchString: string;
  private readonly channelDefaultItems: Array<SelectItem> = [{label: 'Home', value: EItems.HOME, icon: 'pi pi-home'},
    {label: 'Create channel', value: EItems.CREATE_CHANNEL, icon: 'pi pi-plus'},
    {label: 'Create post', value: EItems.CREATE_POST, icon: 'pi pi-plus'},
    {label: 'Search Result', value: EItems.SEARCH_RESULT, icon: 'pi pi-search'},
    {label: 'View profile', value: EItems.VIEW_PROFILE, icon: 'pi pi-user'},
    {label: 'Preferences', value: EItems.PEFERENCES, icon: 'pi pi-cog'},];
  filteredChannelsMultiple: SearchChannelsResultModel[];
  channels: SearchChannelsResultModel[];

  public user
  public channelItems: Array<SelectItem> = [];
  public selectedChannel: number;

  constructor(private _authService: AuthService,
              private _router: Router,
              private _channelService: ChannelService,
              private _themeService: ThemeService) {
  }

  public onUserMenuClick(event: any): void {
    console.log('EVENT', typeof event);
    this.userMenu && this.userMenu.toggle(event);
  }

  public changeTheme(theme: string) {
    this._themeService.switchTheme(theme);
  }

  public onSearch(event: KeyboardEvent): void {
    if (['Enter'].includes(event.key)) {
      this.__search();
    }
  }

  private __loadChannels(): void {
    this.channelItems = this.channelDefaultItems;
    // this._channelService.getAllChannels().subscribe((data: Array<ChannelResponseModel>) => {
    //   this.channelItems = this.channelItems.concat(data.map(item => <SelectItem>{
    //     label: item.name,
    //     value: item.id,
    //     title: item.description
    //   }))
    // });
  }

  public ngOnInit(): void {
    this.__loadUserInfo();
    this.__loadChannels();
  }

  private __loadUserInfo(): void {
    this._authService.loggedIn.subscribe((data: boolean) => this.isLoggedIn = data);
    this._authService.username.subscribe((data: string) => this.username = data);

    this.isLoggedIn = this._authService.isLoggedIn();
    this.username = this._authService.getUserName();
  }

  public goToUserProfile(): void {
    this._router.navigateByUrl('/user-profile/' + this.username);
  }

  public logout(): void {
    this.userMenu.toggle(null);
    this._authService.logout();
    this.isLoggedIn = false;
    this._router.navigateByUrl('/');
  }

  public goToSettings(): void {

  }


  public filterChannelsMultiple(event: any): void {
    let channelMask = event.query;
    this._channelService
      .searchChannels(new SearchChannelsInputModel(channelMask, 0))
      .subscribe((channelsFromServer: SearchChannelsResultModel[]) => {
        this.filteredChannelsMultiple = this.__filterChannels(channelMask, channelsFromServer);
      });
  }

  private __filterChannels(query: string, channels: SearchChannelsResultModel[]): any[] {
    const filtered: SearchChannelsResultModel[] = [];
    // for (let i = 0; i < channels.length; i++) {
    for (const channel of channels) {
      // let channel = channels[i];
      if (channel.channelName.toLowerCase().indexOf(query.toLowerCase()) != -1) {
        filtered.push(channel);
      }
    }
    return filtered;
  }

  public onChangeChannel(value: number): void {
    switch (value) {
      case EItems.HOME:
        this._router.navigateByUrl('/', {skipLocationChange: true}).then(() => this._router.navigate(['/']));
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
      case EItems.PEFERENCES:
        this._router.navigateByUrl('/view-preferences');
        break;
      case EItems.SEARCH_RESULT:
        this._router.navigateByUrl('/search-result');
        break;
      default:
        this._router.navigateByUrl(`/view-channel/${value}`);
        break;

    }
  }

  private __search(): void {
    this._channelService.searchChannels(new SearchChannelsInputModel(this.searchString)).subscribe(data => console.log('Data=>', data));
    this.__selectSearch();
  }

  private __selectSearch(): void {
    this.selectedChannel = EItems.SEARCH_RESULT;
  }
}
