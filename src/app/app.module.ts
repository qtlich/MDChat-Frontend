import {HTTP_INTERCEPTORS, HttpClientModule}        from '@angular/common/http';
import {APP_INITIALIZER, NgModule}                  from '@angular/core';
import {FormsModule, ReactiveFormsModule}           from '@angular/forms';
import {BrowserModule}                              from '@angular/platform-browser';
import {BrowserAnimationsModule}                    from '@angular/platform-browser/animations';
import {FontAwesomeModule}                          from '@fortawesome/angular-fontawesome';
import {NgbModule}                                  from '@ng-bootstrap/ng-bootstrap';
import {ToastrComponentlessModule}                  from 'ngx-toastr';
import {NgxWebstorageModule}                        from 'ngx-webstorage';
import {MessageService}                             from 'primeng/api';
import {AutoCompleteModule}                         from 'primeng/autocomplete';
import {ButtonModule}                               from 'primeng/button';
import {CalendarModule}                             from 'primeng/calendar';
import {CardModule}                                 from 'primeng/card';
import {CheckboxModule}                             from 'primeng/checkbox';
import {ConfirmDialogModule}                        from 'primeng/confirmdialog';
import {DialogModule}                               from 'primeng/dialog';
import {DropdownModule}                             from 'primeng/dropdown';
import {EditorModule}                               from 'primeng/editor';
import {InputTextModule}                            from 'primeng/inputtext';
import {KeyFilterModule}                            from 'primeng/keyfilter';
import {ListboxModule}                              from 'primeng/listbox';
import {MenuModule}                                 from 'primeng/menu';
import {OrderListModule}                            from 'primeng/orderlist';
import {OverlayPanelModule}                         from 'primeng/overlaypanel';
import {PanelModule}                                from 'primeng/panel';
import {PanelMenuModule}                            from 'primeng/panelmenu';
import {PasswordModule}                             from 'primeng/password';
import {PickListModule}                             from 'primeng/picklist';
import {RadioButtonModule}                          from 'primeng/radiobutton';
import {SelectButtonModule}                         from 'primeng/selectbutton';
import {SlideMenuModule}                            from 'primeng/slidemenu';
import {SplitButtonModule}                          from 'primeng/splitbutton';
import {TableModule}                                from 'primeng/table';
import {TabViewModule}                              from 'primeng/tabview';
import {ToastModule}                                from 'primeng/toast';
import {ToolbarModule}                              from 'primeng/toolbar';
import {TooltipModule}                              from 'primeng/tooltip';
import {TreeModule}                                 from 'primeng/tree';
import {VirtualScrollerModule}                      from 'primeng/virtualscroller';
import {AppRoutingModule}                           from './app-routing.module';
import {AppComponent}                               from './app.component';
import {initializer}                                from './app.init';
import {LoginComponent}                             from './auth/login/login.component';
import {SignupComponent}                            from './auth/signup/signup.component';
import {CreateChannelComponent}                     from './channel/create-channel/create-channel.component';
import {ListOfChannelsComponent}                    from './channel/list-of-channels/list-of-channels.component';
import {ViewChannelDescriptionComponent}            from './channel/view-channel-description/view-channel-description.component';
import {ViewChannelPostsComponent}                  from './channel/view-channel-posts/view-channel-posts.component';
import {ViewChannelComponent}                       from './channel/view-channel/view-channel.component';
import {CreateCommentComponent}                     from './comment/create-comment/create-comment.component';
import {UserCommentsComponent}                      from './comment/user-comments/user-comments.component';
import {CommentItemComponent}                       from './comment/view-post-comments/comment-item/comment-item.component';
import {ViewCommentsComponent}                      from './comment/view-post-comments/view-post-comments.component';
import {InnerHtmlDirectivesModule}                  from './common/directives/inner-html-directive';
import {RemoveFormattingAndTruncateDirectiveModule} from './common/directives/remove-formatting-and-truncate-directive';
import {CleanHtmlAndTruncateModule}                 from './common/directives/truncate-and-clean-html-directive';
import {TruncateAndSafeHtmlDirectiveModule}         from './common/directives/truncate-and-safe-html-directive';
import {AppConfigService}                           from './common/services/app.config.service';
import {HeaderComponent}                            from './header/header.component';
import {HomeComponent}                              from './home/home.component';
import {CreatePostLittleComponent}                  from './post/create-post-little/create-post-little.component';
import {CreatePostComponent}                        from './post/create-post/create-post.component';
import {ViewPostComponent}                          from './post/view-post/view-post.component';
import {ChannelSideBarComponent}                    from './shared/channel-side-bar/channel-side-bar.component';
import {MainPostTileComponent}                      from './shared/main-post-tile/main-post-tile.component';
import {SideBarComponent}                           from './shared/side-bar/side-bar.component';
import {DownVotedUserPostsTileComponent}            from './shared/user.posts/downvoted-user-post-tile/upvoted-user-posts-tile.component';
import {HiddenUserPostsTileComponent}               from './shared/user.posts/hidden-user-posts-tile/hidden-user-posts-tile.component';
import {HistoryUserPostsTileComponent}              from './shared/user.posts/history-user-posts-tile/history-user-posts-tile.component';
import {SavedUserPostsTileComponent}                from './shared/user.posts/saved-user-post-tile/saved-user-posts-tile.component';
import {UpVotedUserPostsTileComponent}              from './shared/user.posts/upvoted-user-post-tile/upvoted-user-posts-tile.component';
import {UserPostTileComponent}                      from './shared/user.posts/user-post-tile/user-post-tile.component';
import {VoteButtonComponent}                        from './shared/vote-button/vote-button.component';
import {TokenInterceptor}                           from './token-interceptor';
import {UserProfileComponent}                       from './user/user-profile/user-profile.component';
import {ColorSchemeComponent}                       from './user/user-settings/color-scheme/color-scheme.component';
import {UserSettingsComponent}                      from './user/user-settings/user-settings.component';

@NgModule({
            declarations: [AppComponent,
                           HeaderComponent,
                           SignupComponent,
                           LoginComponent,
                           HomeComponent,
                           MainPostTileComponent,
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
                           ViewChannelDescriptionComponent,
                           ViewCommentsComponent,
                           CreateCommentComponent,
                           CommentItemComponent,
                           UserPostTileComponent,
                           HistoryUserPostsTileComponent,
                           SavedUserPostsTileComponent,
                           HiddenUserPostsTileComponent,
                           UpVotedUserPostsTileComponent,
                           DownVotedUserPostsTileComponent,
                           UserProfileComponent,
                           UserSettingsComponent,
                           ColorSchemeComponent,
                           UserCommentsComponent],
            imports:      [BrowserModule,
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
                           InnerHtmlDirectivesModule,
                           OverlayPanelModule],
            providers:    [{
              provide:    APP_INITIALIZER,
              useFactory: initializer,
              multi:      true,
              deps:       [AppConfigService]
            },
                           {
                             provide:  HTTP_INTERCEPTORS,
                             useClass: TokenInterceptor,
                             multi:    true
                           },
                           MessageService],
            bootstrap:    [AppComponent]
          })
export class AppModule
{
}
