import {Component, OnInit} from '@angular/core';
import {faUser} from '@fortawesome/free-solid-svg-icons';
import {AuthService} from '../auth/shared/auth.service';
import {Router} from '@angular/router';
import {ChannelService} from "../channel/channel.service";
import {SelectItem} from "primeng/api";
import {ChannelResponseModel} from "../channel/models/channel.response.model";

enum EItems
{
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
export class HeaderComponent implements OnInit
{
  items:any[];
  faUser = faUser;
  public isLoggedIn: boolean;
  public username: string;
  public searchString;
  private readonly channelDefaultItems: Array<SelectItem> = [{label: 'Home', value: EItems.HOME, icon: 'pi pi-home'},
    {label: 'Create channel', value: EItems.CREATE_CHANNEL, icon: 'pi pi-plus'},
    {label: 'Create post', value: EItems.CREATE_POST, icon: 'pi pi-plus'},
    {label: 'Search Result', value: EItems.SEARCH_RESULT, icon: 'pi pi-search'},
    {label: 'View profile', value: EItems.VIEW_PROFILE, icon: 'pi pi-user'},
    {label: 'Preferences', value: EItems.PEFERENCES, icon: 'pi pi-cog'},];

  channelItems: Array<SelectItem> = [];
  selectedChannel: number;

  constructor(private _authService: AuthService,
              private _router: Router,
              private _channelService: ChannelService)
  {
  }

  public onInputData(event: any): void
  {
    console.log('event', this.searchString);
  }

  public onSearch(event: KeyboardEvent): void
  {
    if (["Enter"].includes(event.key))
    {
      this.__search();
    }
    console.log('Key Up Event=>', event);
  }

  private __loadChannels(): void
  {
    this._channelService.getAllChannels().subscribe((data: Array<ChannelResponseModel>) =>
                                                    {
                                                      this.channelItems = this.channelDefaultItems.concat(data.map(item => <SelectItem>{
                                                        label: item.name,
                                                        value: item.id,
                                                        title: item.description
                                                      }))
                                                    });
  }

  public ngOnInit(): void
  {
    this.__loadUserInfo();
    this.__loadChannels();
  }

  private __loadUserInfo(): void
  {
    this._authService.loggedIn.subscribe((data: boolean) => this.isLoggedIn = data);
    this._authService.username.subscribe((data: string) => this.username = data);

    this.isLoggedIn = this._authService.isLoggedIn();
    this.username = this._authService.getUserName();
  }

  public goToUserProfile(): void
  {
    this._router.navigateByUrl('/user-profile/' + this.username);
  }

  public logout(): void
  {
    this._authService.logout();
    this.isLoggedIn = false;
    this._router.navigateByUrl('/');
  }

  public goToSettings(): void
  {

  }

  /**
   * @param value
   */
  public onChangeChannel(value: number): void
  {
    switch (value)
    {
      case EItems.HOME:
        this._router.navigateByUrl('/');
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

  private __search(): void
  {
    console.log('__search()');
    this.__selectSearch();
  }

  private __selectSearch(): void
  {
    this.selectedChannel = EItems.SEARCH_RESULT;
  }
}
