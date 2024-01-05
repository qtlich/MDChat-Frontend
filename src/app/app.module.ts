import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HeaderComponent} from './header/header.component';
import {SignupComponent} from './auth/signup/signup.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {LoginComponent} from './auth/login/login.component';
import {NgxWebstorageModule} from 'ngx-webstorage';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {TokenInterceptor} from './token-interceptor';
import {HomeComponent} from './home/home.component';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {PostTileComponent} from './shared/post-tile/post-tile.component';
import {VoteButtonComponent} from './shared/vote-button/vote-button.component';
import {SideBarComponent} from './shared/side-bar/side-bar.component';
import {CreateChannelComponent} from './channel/create-channel/create-channel.component';
import {CreatePostComponent} from './post/create-post/create-post.component';
import {ListOfChannelsComponent} from './channel/list-of-channels/list-of-channels.component';
import {ViewPostComponent} from './post/view-post/view-post.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {UserProfileComponent} from './user/user-profile/user-profile.component';
import {ViewChannelComponent} from './channel/view-channel/view-channel.component';
import {EditorModule} from 'primeng/editor';
import {DropdownModule} from 'primeng/dropdown';
import {InputTextModule} from 'primeng/inputtext';
import {CreatePostLittleComponent} from './post/create-post-little/create-post-little.component';
import {DialogModule} from 'primeng/dialog';
import {TooltipModule} from 'primeng/tooltip';
import {RadioButtonModule} from 'primeng/radiobutton';
import {ButtonModule} from 'primeng/button';
import {MessageService} from 'primeng/api';
import {PanelModule} from 'primeng/panel';
import {ToolbarModule} from 'primeng/toolbar';
import {SplitButtonModule} from 'primeng/splitbutton';
import {VirtualScrollerModule} from 'primeng/virtualscroller';
import {ChannelSideBarComponent} from './shared/channel-side-bar/channel-side-bar.component';
import {TruncateAndSafeHtmlDirectiveModule} from './common/directives/truncate-and-safe-html-directive';
import {ViewChannelPostsComponent} from './channel/view-channel-posts/view-channel-posts.component';
import {TabViewModule} from 'primeng/tabview';
import {AutoCompleteModule} from 'primeng/autocomplete';
import {PickListModule} from 'primeng/picklist';
import {OrderListModule} from 'primeng/orderlist';
import {TreeModule} from 'primeng/tree';
import {CalendarModule} from 'primeng/calendar';
import {MenuModule} from 'primeng/menu';
import {PanelMenuModule} from 'primeng/panelmenu';
import {ListboxModule} from 'primeng/listbox';
import {TableModule} from 'primeng/table';
import {SlideMenuModule} from 'primeng/slidemenu';
import {PasswordModule} from 'primeng/password';
import {KeyFilterModule} from 'primeng/keyfilter';
import {RemoveFormattingAndTruncateDirectiveModule} from './common/directives/remove-formatting-and-truncate-directive';
import {CardModule} from 'primeng/card';
import {ToastrComponentlessModule} from 'ngx-toastr';
import {ToastModule} from 'primeng/toast';
import {CleanHtmlAndTruncateModule} from './common/directives/truncate-and-clean-html-directive';
import {CheckboxModule} from 'primeng/checkbox';
import {SelectButtonModule} from 'primeng/selectbutton';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {ViewChannelDescriptionComponent} from './channel/view-channel-description/view-channel-description.component';
import {InnerHtmlDirectivesModule} from './common/directives/inner-html-directive';

@NgModule({
            declarations: [AppComponent,
                           HeaderComponent,
                           SignupComponent,
                           LoginComponent,
                           HomeComponent,
                           PostTileComponent,
                           VoteButtonComponent,
                           SideBarComponent,
                           ChannelSideBarComponent,
                           CreateChannelComponent,
                           CreatePostComponent,
                           ListOfChannelsComponent,
                           ViewChannelComponent,
                           ViewPostComponent,
                           UserProfileComponent,
                           CreatePostLittleComponent,
                           ViewChannelPostsComponent,
                           ViewChannelDescriptionComponent],
            imports     : [BrowserModule,
                           NgxWebstorageModule.forRoot(),
                           ToastrComponentlessModule.forRoot(),
                           AppRoutingModule,
                           ReactiveFormsModule,
                           HttpClientModule,
                           InputTextModule,
                           BrowserAnimationsModule,
                           FontAwesomeModule,
                           EditorModule,
                           DropdownModule,
                           FormsModule,
                           NgbModule,
                           DialogModule,
                           ButtonModule,
                           ToastModule,
                           TooltipModule,
                           RadioButtonModule,
                           PanelModule,
                           ToolbarModule,
                           SplitButtonModule,
                           VirtualScrollerModule,
                           TruncateAndSafeHtmlDirectiveModule,
                           TabViewModule,
                           AutoCompleteModule,
                           PickListModule,
                           OrderListModule,
                           TreeModule,
                           CalendarModule,
                           MenuModule,
                           PanelMenuModule,
                           ListboxModule,
                           TableModule,
                           SlideMenuModule,
                           PasswordModule,
                           KeyFilterModule,
                           RemoveFormattingAndTruncateDirectiveModule,
                           CardModule,
                           CleanHtmlAndTruncateModule,
                           CheckboxModule,
                           SelectButtonModule,
                           ConfirmDialogModule,
                           InnerHtmlDirectivesModule],
            providers   : [
              {
                provide : HTTP_INTERCEPTORS,
                useClass: TokenInterceptor,
                multi   : true
              },
              MessageService
            ],
            bootstrap   : [AppComponent]
          })
export class AppModule
{
}
