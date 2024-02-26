import {Component, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {Router}                                                 from '@angular/router';
import {AuthDataService}                                        from '../../../auth/shared/auth.data.service';
import {BaseComponent}                                          from '../../../common/components/base.component/base.component';
import {GlobalBusService}                                       from '../../../common/services/global.bus.service';
import {USER_POSTS_TYPES}                                       from '../../../services/posts/enums/user.posts.types.enum';
import {GetUserPostsUniversalRequestModel}                      from '../../../services/posts/models/get.user.posts.universal.request.model';
import {ILoadPostUniversalResult, PostDataService}              from '../../../services/posts/post.data.service';
import {RecentPostScreeData}                                    from './models/recent.post.scree.data.model';

@Component({
             selector:    'recent-posts',
             templateUrl: './recent.posts.component.html',
             styleUrls:   ['./recent.posts.component.css']
           })
export class RecentPostsComponent extends BaseComponent implements OnInit, OnDestroy, OnChanges
{
  public sD: RecentPostScreeData = new RecentPostScreeData();

  constructor(protected router: Router,
              protected postService: PostDataService,
              serviceBus: GlobalBusService,
              authService: AuthDataService)
  {
    super(serviceBus, authService);
  }

  public ngOnInit()
  {
    super.ngOnInit();
    this.postService.getUserPostsUniversal(new GetUserPostsUniversalRequestModel(null,
                                                                                 USER_POSTS_TYPES.USER_RECENT_POSTS,
                                                                                 null,
                                                                                 0,
                                                                                 10,
                                                                                 -1,
                                                                                 0));
  }

  public goToPost(postId: number): void
  {
    this.router.navigateByUrl('/create-post');
  }

  public ngOnChanges(changes: SimpleChanges)
  {
  }

  protected onSubscribeData()
  {
    super.onSubscribeData();
    this.subscribe(this.postService.onLoadUserPostsUniversalEvent().subscribe((result: ILoadPostUniversalResult) =>
                                                                              {
                                                                                if(result.userView == USER_POSTS_TYPES.USER_RECENT_POSTS)
                                                                                {
                                                                                  this.sD.posts = result.posts
                                                                                }
                                                                              }));
  }
}
