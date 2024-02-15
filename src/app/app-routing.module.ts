import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SignupComponent} from './auth/signup/signup.component';
import {LoginComponent} from './auth/login/login.component';
import {HomeComponent} from './home/home.component';
import {CreatePostComponent} from './post/create-post/create-post.component';
import {CreateChannelComponent} from './channel/create-channel/create-channel.component';
import {ListOfChannelsComponent} from './channel/list-of-channels/list-of-channels.component';
import {ViewPostComponent}    from './post/view-post/view-post.component';
import {UserProfileComponent} from './user/user-profile/user-profile.component';
import {AuthGuard}            from './auth/auth.guard';
import {ViewChannelComponent} from './channel/view-channel/view-channel.component';
import {ViewChannelPostsComponent} from './channel/view-channel-posts/view-channel-posts.component';
import {UserSettingsComponent} from './user/user-settings/user-settings.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'view-post/:id', component: ViewPostComponent},
   {path: 'list-of-channels', component: ListOfChannelsComponent},
  {path: 'view-channel/:id', component: ViewChannelComponent},
  {path: 'view-channel-posts/:id', component: ViewChannelPostsComponent},
  {path: 'create-post', component: CreatePostComponent, canActivate: [AuthGuard]},
  {path: 'create-channel', component: CreateChannelComponent, canActivate: [AuthGuard]},
  {path: 'sign-up', component: SignupComponent},
  {path: 'login', component: LoginComponent},
  {path: 'user/:name', component: UserProfileComponent, canActivate: [AuthGuard]},
  {path: 'settings', component: UserSettingsComponent, canActivate: [AuthGuard]}
];

@NgModule({
            imports: [RouterModule.forRoot(routes,{anchorScrolling: 'enabled'})],
            exports: [RouterModule]
          })
export class AppRoutingModule {}
