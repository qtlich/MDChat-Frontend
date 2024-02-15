import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router}                       from '@angular/router';
import {ConfirmationService}          from 'primeng/api';
import {AuthDataService}              from '../../auth/shared/auth.data.service';
import {GlobalBusService}             from '../../common/services/global.bus.service';
import {USER_POSTS_TYPES}             from '../../services/posts/enums/user.posts.types.enum';
import {PostDataService}              from '../../services/posts/post.data.service';
import {BaseUserPostsComponent}       from '../user.posts/common/base.user.posts.component';

@Component({
             selector:    'main-post-tile',
             templateUrl: '../user.posts/common/base.user.posts.component.html',
             styleUrls:   ['../user.posts/common/base.user.posts.component.css'],
             providers:   [ConfirmationService]
           })
export class MainPostTileComponent extends BaseUserPostsComponent implements OnInit, OnDestroy
{
  constructor(router: Router,
              confirmationService: ConfirmationService,
              postService: PostDataService,
              serviceBus: GlobalBusService,
              authService: AuthDataService)
  {
    super(router, confirmationService, postService, serviceBus, authService);
    this.selectedView = USER_POSTS_TYPES.MAIN_POSTS;
  }
}
