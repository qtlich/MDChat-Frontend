import {Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges}                                                               from '@angular/core';
import {Router}                                                                                                                      from '@angular/router';
import {faBookmark as faRegularBookmark}                                                                                             from '@fortawesome/free-regular-svg-icons';
import {faBookmark as faSolidBookmark, faComment, faEye, faEyeSlash, faShare, faTrashAlt}                                            from '@fortawesome/free-solid-svg-icons';
import {ConfirmationService, LazyLoadEvent, SelectItem}                                                                              from 'primeng-lts';
import {AuthDataService}                                                                                                             from '../../../auth/shared/auth.data.service';
import {BaseComponent}                                                                                                               from '../../../common/components/base.component/base.component';
import {executeIf, isChangedAndNotNullOrUndefined, isEmptyArray, isEmptyStringField, isNullOrUndefined, showOperationResultMessages} from '../../../common/core/core.free.functions';
import {EActionType}                                                                                                                 from '../../../common/models/event.type';
import {GlobalBusService}                                                                                                            from '../../../common/services/global.bus.service';
import {ChannelDataService}                                                                                                          from '../../../services/channels/channel.data.service';
import {GetChannelPostsUniversalRequestModel}                                                                                        from '../../../services/channels/models/get.channel.posts.universal.request.model';
import {GetChannelPostsUniversalResponseModel}                                                                                       from '../../../services/channels/models/get.channel.posts.universal.response.model';
import {USER_POSTS_TYPES}                                                                                                            from '../../../services/posts/enums/user.posts.types.enum';
import {BookmarkPostRequestModel}                                                                                                    from '../../../services/posts/models/bookmark.post.request.model';
import {GetUserPostsUniversalResponseModel}                                                                                          from '../../../services/posts/models/get.user.posts.universal.response.model';
import {ShowHidePostRequestModel}                                                                                                    from '../../../services/posts/models/show.hide.post.request.model';
import {IBookmarkPostResult, IDeletePostResult, IShowHidePostResult, PostDataService}                                                from '../../../services/posts/post.data.service';
import {IVoteResult}                                                                                                                 from '../../../shared/vote-button/services/vote.data.service';

@Component({
             selector:    'view-channel-posts',
             templateUrl: './view-channel-posts.component.html',
             styleUrls:   ['./view-channel-posts.component.css'],
             providers:   [ConfirmationService]
           })
export class ViewChannelPostsComponent extends BaseComponent implements OnInit, OnDestroy, OnChanges
{
  readonly faComments: any = faComment;
  readonly faShare: any = faShare;
  readonly faSolidBookMark: any = faSolidBookmark;
  readonly faEmptyBookMark: any = faRegularBookmark;
  readonly faEye: any = faEye;
  readonly faEyeSlash: any = faEyeSlash;
  readonly faTrashAlt: any = faTrashAlt; //IconDefinition
  @Input() channelId: number;
  @Input() showSortBar: boolean = true;
  public selectedView: number = 0;
  public posts: GetChannelPostsUniversalResponseModel[] = [];
  public existingSortingDD: SelectItem[] = [{label: 'New', value: 'New', icon: 'pi pi-sort-amount-down'},
                                            {label: 'Best', value: 'Best', icon: 'pi pi-thumbs-up'},
                                            {label: 'Hot', value: 'Hot', icon: 'fa fa-eye-slash'},];
  public selectedSortBy: string = this.existingSortingDD[0].value;
  public selectedItem: GetChannelPostsUniversalResponseModel;
  public hoverPostId: number;
  private _first: number;
  private _rows: number;

  constructor(protected router: Router,
              protected confirmationService: ConfirmationService,
              protected postService: PostDataService,
              protected channelService: ChannelDataService,
              serviceBus: GlobalBusService,
              authService: AuthDataService)
  {
    super(serviceBus, authService);
    this.__clear();
  }

  public navigateToChannel(channelId: number): void
  {
    this.router.navigate(['/view-channel/', channelId]);
  }

  public navigateToUser(userName: string): void
  {
    this.router.navigate(['/view-user/', userName]);
  }

  public ngOnChanges(changes: SimpleChanges)
  {
    executeIf(isChangedAndNotNullOrUndefined(changes, 'channelId'), () => this.__refreshPosts());
  }

  public onBookmarkPostClick(postId: number, bookmarkPost: boolean = true): void
  {
    this.postService.bookmarkPost(new BookmarkPostRequestModel(postId),bookmarkPost)
  }

  public copyLink(link?: string): void
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
    this.subscribe(this.channelService.onLoadChannelPostsUniversalEvent().subscribe((data: GetChannelPostsUniversalResponseModel[]) => this.__updatePostsNew(data)));
    this.subscribe(this.serviceBus.onEvent(EActionType.ON_DELETE_POST_ACTION, (result: IDeletePostResult) => this.onAfterDeletePost(result)));
    this.subscribe(this.serviceBus.onEvent(EActionType.ON_SHOW_HIDE_POST_ACTION, (result: IShowHidePostResult) => this.onAfterShowHidePost(result)));
    this.subscribe(this.serviceBus.onEvent(EActionType.ON_BOOKMARK_POST_ACTION, (result: IBookmarkPostResult) => this.onAfterBookmarkPost(result)));
    this.subscribe(this.serviceBus.onEvent(EActionType.ON_VOTE_ACTION, (result: IVoteResult) => this.onAfterVotePost(result)));
    this.subscribe(this.channelService.onLoadingEvent().subscribe(loading => this.loading = loading));
    this.subscribe(this.channelService.onBlockButtonEvent().subscribe(blockButton => this.blockButton = blockButton));
  }

  protected onAfterBookmarkPost(item: IBookmarkPostResult): void
  {
    this.__onBookmarkPost(item);
  }

  protected onAfterVotePost(item: IVoteResult): void
  {
    this.__onVotePost(item);
  }
  private __onVotePost(item: IVoteResult):void
  {

  }
  protected onAfterDeletePost(item: IDeletePostResult): void
  {
    item.success && this.__deletePostFromList(item.postId);
  }

  protected onAfterShowHidePost(item: IShowHidePostResult): void
  {
    item.success && this.__refreshPosts();
  }

  private __updatePostsNew(newPosts: GetChannelPostsUniversalResponseModel[]): void
  {
    this.posts = [...this.__updateExistingPostsNew(newPosts), ...this.__addNewPostsNew(newPosts)];
  }

  private __updateExistingPostsNew(newPosts: GetChannelPostsUniversalResponseModel[]): GetChannelPostsUniversalResponseModel[]
  {
    return this.posts.map(post =>
                          {
                            const updatedPost = newPosts.find(newPost => newPost.postId === post.postId);
                            return updatedPost ? {...post, ...updatedPost} : post;
                          });
  }

  private __addNewPostsNew(newPosts: GetChannelPostsUniversalResponseModel[]): GetChannelPostsUniversalResponseModel[]
  {
    return newPosts.filter((newPost: GetChannelPostsUniversalResponseModel) => !this.posts.some((post: GetChannelPostsUniversalResponseModel) => post.postId === newPost.postId));
  }

  private __onBookmarkPost(it: IBookmarkPostResult): void
  {
    if(it.success && !isEmptyArray(this.posts))
    {
      this.posts.forEach((item: GetChannelPostsUniversalResponseModel) =>
                         {
                           if(item.postId == it.postId)
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
    if(this.__isValidDataForRefresh())
    {
      this.__clear();
      this.channelService
          .getChannelPostsUniversal(new GetChannelPostsUniversalRequestModel(null,
                                                                             this.channelId,
                                                                             null,
                                                                             0,
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
