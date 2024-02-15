import {Component, OnDestroy, OnInit}         from '@angular/core';
import {Router}                               from '@angular/router';
import {ConfirmationService}                  from 'primeng/api';
import {AuthDataService}                      from '../../../auth/shared/auth.data.service';
import {isEmptyArray}                         from '../../../common/core/core.free.functions';
import {GlobalBusService}                     from '../../../common/services/global.bus.service';
import {USER_POSTS_TYPES}                     from '../../../services/posts/enums/user.posts.types.enum';
import {GetUserPostsUniversalResponseModel}   from '../../../services/posts/models/get.user.posts.universal.response.model';
import {IShowHidePostResult, PostDataService} from '../../../services/posts/post.data.service';
import {BaseUserPostsComponent}               from '../common/base.user.posts.component';

@Component({
             selector:    'user-posts-history-tile',
             templateUrl: '../common/base.user.posts.component.html',
             styleUrls:   ['../common/base.user.posts.component.css'],
             providers:   [ConfirmationService]
           })
export class HistoryUserPostsTileComponent extends BaseUserPostsComponent implements OnInit, OnDestroy
{
  constructor(router: Router,
              confirmationService: ConfirmationService,
              postService: PostDataService,
              serviceBus: GlobalBusService,
              authService: AuthDataService)
  {
    super(router, confirmationService, postService, serviceBus, authService);
    this.selectedView = USER_POSTS_TYPES.USER_HISTORY_POSTS;
  }

  protected onAfterShowHidePost(item: IShowHidePostResult)
  {
    this.__changeHiddenState(item);
  }

  private __changeHiddenState(it: IShowHidePostResult): void
  {
    if (it.success && !isEmptyArray(this.posts))
    {
      this.posts.forEach((item: GetUserPostsUniversalResponseModel) =>
                         {
                           if (item.postId == it.postId)
                           {
                             item.hidden = !it.showPost;
                           }
                         });
    }
  }
}
