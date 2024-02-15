import {Component, Input, OnDestroy, OnInit}                                                                    from '@angular/core';
import {Router}                                                                                                 from '@angular/router';
import {faBookmark as faRegularBookmark}                                                                        from '@fortawesome/free-regular-svg-icons';
import {faBookmark as faSolidBookmark, faComment, faEye, faEyeSlash, faShare, faTrashAlt}                       from '@fortawesome/free-solid-svg-icons';
import {ConfirmationService, LazyLoadEvent, SelectItem}                                                         from 'primeng-lts';
import {AuthDataService}                                                                                        from '../../../auth/shared/auth.data.service';
import {BaseComponent}                                                                                          from '../../../common/components/base.component/base.component';
import {isEmptyArray, isEmptyStringField, isNullOrUndefined, showOperationResultMessages}                       from '../../../common/core/core.free.functions';
import {EActionType}                                                                                            from '../../../common/models/event.type';
import {GlobalBusService}                                                                                       from '../../../common/services/global.bus.service';
import {USER_POSTS_TYPES}                                                                                       from '../../../services/posts/enums/user.posts.types.enum';
import {BookmarkPostRequestModel}                                                                               from '../../../services/posts/models/bookmark.post.request.model';
import {GetUserPostsUniversalRequestModel}                                                                      from '../../../services/posts/models/get.user.posts.universal.request.model';
import {GetUserPostsUniversalResponseModel}                                                                     from '../../../services/posts/models/get.user.posts.universal.response.model';
import {ShowHidePostRequestModel}                                                                               from '../../../services/posts/models/show.hide.post.request.model';
import {IBookmarkPostResult, IDeletePostResult, ILoadPostUniversalResult, IShowHidePostResult, PostDataService} from '../../../services/posts/post.data.service';

@Component({
             selector:    'base-user-post',
             templateUrl: './base.user.posts.component.html',
             styleUrls:   ['./base.user.posts.component.css'],
             providers:   [ConfirmationService]
           })
export abstract class BaseUserPostsComponent extends BaseComponent implements OnInit, OnDestroy
{
  readonly faComments: any = faComment;
  readonly faShare: any = faShare;
  readonly faSolidBookMark: any = faSolidBookmark;
  readonly faEmptyBookMark: any = faRegularBookmark;
  readonly faEye: any = faEye;
  readonly faEyeSlash: any = faEyeSlash;
  readonly faTrashAlt: any = faTrashAlt; //IconDefinition
  @Input() selectedView: USER_POSTS_TYPES = USER_POSTS_TYPES.NOT_SELECTED;
  @Input() showSortBar: boolean = false;
  public posts: GetUserPostsUniversalResponseModel[] = [];
  public existingSortingDD: SelectItem[] = [{label: 'New', value: 'New', icon: 'pi pi-sort-amount-down'},
                                            {label: 'Best', value: 'Best', icon: 'pi pi-thumbs-up'},
                                            {label: 'Hot', value: 'Hot', icon: 'fa fa-eye-slash'},];
  public selectedSortBy: string = this.existingSortingDD[0].value;
  public selectedItem: GetUserPostsUniversalResponseModel;
  //public readonly totalRecords: number = 5;
  private _first: number;
  private _rows: number;
  public hoverPostId: number;

  protected constructor(protected router: Router,
                        protected confirmationService: ConfirmationService,
                        protected postService: PostDataService,
                        serviceBus: GlobalBusService,
                        authService: AuthDataService)
  {
    super(serviceBus, authService);
    this.__clear();
  }

  public onBookmarkPostClick(postId: number, bookmarkPost: boolean = true): void
  {
    this.postService.bookmarkPost(new BookmarkPostRequestModel(postId, bookmarkPost))
  }

  public copyLink(link: string): void
  {
    console.log('Link=>', this.hoverPostId);
    this.showInfo('Link is copied');
    // document.clipcopy(this.hoverPostId.toString());
  }

  public onHidePostClick(postId: number, showPost: boolean = true): void
  {
    this.postService.showHidePost(new ShowHidePostRequestModel(postId, showPost));
  }

  public onRowSelect(item: GetUserPostsUniversalResponseModel): void
  {
    // this.goToPost(item);
  }

  public goToPost(item: GetUserPostsUniversalResponseModel): void
  {
    this.router.navigateByUrl(`/view-post/${item.postId}`);
  }

  public loadPostsLazy(event: LazyLoadEvent)
  {
    console.error('loadPostsLazy', event);
    this.__load(event.first, event.rows);
  }

  public onChangeSortMode(value: string): void
  {
    this.__clear();
    this.__refreshPosts();
  }

  public onDeleteClick(postId: number): void
  {
    this.confirmationService.confirm({
                                       message: 'Are you sure that you want to delete post?',
                                       accept:  () => this.postService.deletePost(postId)
                                     });
  }

  protected onAfterLoginAction(value: boolean)
  {
    super.onAfterLoginAction(value);
    value && this.__refreshPosts();
  }

  protected onAfterLogoutAction(value: boolean)
  {
    super.onAfterLogoutAction(value);
    value && this.__refreshPosts();
  }

  protected onRefreshAllDataAction(value: boolean)
  {
    super.onRefreshAllDataAction(value);
    value && this.__refreshPosts();
  }

  protected onSubscribeData()
  {
    super.onSubscribeData();
    this.subscribe(this.postService.onLoadUserPostsUniversalEvent().subscribe((result: ILoadPostUniversalResult) =>
                                                                              {
                                                                                if (this.selectedView == result.userView)
                                                                                {
                                                                                  this.__updatePostsNew(result.posts);
                                                                                }
                                                                              }));
    this.subscribe(this.serviceBus.onEvent(EActionType.ON_DELETE_POST_ACTION, (result: IDeletePostResult) => this.onAfterDeletePost(result)));
    this.subscribe(this.serviceBus.onEvent(EActionType.ON_SHOW_HIDE_POST_ACTION, (result: IShowHidePostResult) => this.onAfterShowHidePost(result)));
    this.subscribe(this.serviceBus.onEvent(EActionType.ON_BOOKMARK_POST_ACTION, (result: IBookmarkPostResult) => this.onAfterBookmarkPost(result)));
    this.subscribe(this.serviceBus.onEvent(EActionType.ON_VOTE_ACTION, (result: IBookmarkPostResult) => this.onAfterVotePost(result)));
    this.subscribe(this.postService.onLoadingEvent().subscribe(loading => this.loading = loading));
    this.subscribe(this.postService.onBlockButtonEvent().subscribe(blockButton => this.blockButton = blockButton));
  }

  private __updatePosts(newPosts: GetUserPostsUniversalResponseModel[]): void
  {
    this.posts = this.__updateExistingPosts(newPosts);
    this.__addNewPosts(newPosts);
  }

  private __addNewPosts(newPosts: GetUserPostsUniversalResponseModel[]): void
  {
    newPosts.filter(newPost => !this.posts.some(post => post.postId === newPost.postId))
            .forEach(newPost => this.posts.push(newPost));
  }

  private __updateExistingPosts(newPosts: GetUserPostsUniversalResponseModel[]): GetUserPostsUniversalResponseModel[]
  {
    return this.posts.map(post =>
                          {
                            const updatedPost = newPosts.find(newPost => newPost.postId === post.postId);
                            return updatedPost ? {...post, ...updatedPost} : post;
                          });
  }

  private __updatePostsNew(newPosts: GetUserPostsUniversalResponseModel[]): void {
    this.posts = [...this.__updateExistingPostsNew(newPosts), ...this.__addNewPostsNew(newPosts)];
  }

  private __updateExistingPostsNew(newPosts: GetUserPostsUniversalResponseModel[]): GetUserPostsUniversalResponseModel[] {
    return this.posts.map(post => {
      const updatedPost = newPosts.find(newPost => newPost.postId === post.postId);
      return updatedPost ? { ...post, ...updatedPost } : post;
    });
  }

  private __addNewPostsNew(newPosts: GetUserPostsUniversalResponseModel[]): GetUserPostsUniversalResponseModel[] {
    return newPosts.filter(newPost => !this.posts.some(post => post.postId === newPost.postId));
  }

  protected onAfterBookmarkPost(item: IBookmarkPostResult): void
  {
    this.__onBookmarkPost(item);
  }
  protected onAfterVotePost(item: IBookmarkPostResult): void
  {
    this.__onBookmarkPost(item);
  }

  protected onAfterDeletePost(item: IDeletePostResult): void
  {
    item.success && this.__deletePostFromList(item.postId);
  }

  protected onAfterShowHidePost(item: IShowHidePostResult): void
  {
    item.success && this.__deletePostFromList(item.postId);
  }

  private __onBookmarkPost(it: IBookmarkPostResult): void
  {
    if (it.success && !isEmptyArray(this.posts))
    {
      this.posts.forEach((item: GetUserPostsUniversalResponseModel) =>
                         {
                           if (item.postId == it.postId)
                           {
                             item.saved = it.bookmarkPost;
                           }
                         });
    }
  }

  private __load(first: number, rows: number): void
  {
    this._first = first;
    this._rows = rows;
    this.__refreshPosts();
  }

  private __refreshPosts(): void
  {
    if (this.__isValidDataForRefresh())
    {
      this.postService
          .getUserPostsUniversal(new GetUserPostsUniversalRequestModel(null,
                                                                       this.selectedView,
                                                                       !isEmptyStringField(this.selectedSortBy) ? this.selectedSortBy : 'New',
                                                                       this._first || 0,
                                                                       this._rows || 10,
                                                                       200,
                                                                       200));
    }
    else
    {
      showOperationResultMessages(this.serviceBus, this.informationMessages);
    }
  }

  private __isValidDataForRefresh(): boolean
  {
    this.clearInformationMessages();
    let i: number;
    (isNullOrUndefined(this.selectedView) || this.selectedView == USER_POSTS_TYPES.NOT_SELECTED) && this.addInformationMessage(--i, `You should select needed view`)
    return isEmptyArray(this.informationMessages);
  }

  private __clear(): void
  {
    this.posts = [];
  }

  private __deletePostFromList(postId: number): void
  {
    this.posts = !isEmptyArray(this.posts) ? this.posts.filter((item: GetUserPostsUniversalResponseModel) => item.postId != postId) : [];
  }
}
