import {Injectable}                                                                            from '@angular/core';
import {Observable, Subject}                                                                   from 'rxjs';
import {isAllOperationsSuccess, isEmptyArray, isEmptyNumberField, showOperationResultMessages} from '../../common/core/core.free.functions';
import {OPERATION_TYPES}                                                                       from '../../common/core/enums/operation.types';
import {EActionType}                                                                           from '../../common/models/event.type';
import {OperationResult}                                                                       from '../../common/models/operation.result.model';
import {BaseService}                                                                           from '../../common/services/base.service';
import {GlobalBusService}                                                                      from '../../common/services/global.bus.service';
import {PostCudRequestModel}                                                                   from '../../post/create-post/models/post.cud.request.model';
import {PostCudResponseModel}                                                                  from '../../post/create-post/models/post.cud.response.model';
import {PostModel}                                                                             from '../../shared/post-model';
import {USER_POSTS_TYPES}                                                                      from './enums/user.posts.types.enum';
import {BookmarkPostRequestModel}                                                              from './models/bookmark.post.request.model';
import {GetPostByIdDtoRequestModel}                                                            from './models/get.post.by.id.dto.request.model';
import {GetPostByIdDtoResponseModel}                                                           from './models/get.post.by.id.dto.response.model';
import {GetUserPostsUniversalRequestModel}                                                     from './models/get.user.posts.universal.request.model';
import {GetUserPostsUniversalResponseModel}                                                    from './models/get.user.posts.universal.response.model';
import {ShowHidePostRequestModel}                                                              from './models/show.hide.post.request.model';
import {ShowHidePostResponseModel}                                                             from './models/show.hide.post.response.model';
import {PostRestService}                                                                       from './post.rest.service';

export interface IDeletePostResult
{
  success: boolean,
  postId: number
}

export interface IShowHidePostResult
{
  success: boolean,
  postId: number,
  showPost: boolean;
}

export interface IBookmarkPostResult
{
  success: boolean,
  postId: number,
  bookmarkPost: boolean;
}

export interface ICUDPostResult
{
  success: boolean,
  item: PostCudRequestModel,
  result: PostCudResponseModel[]
}

export interface  ILoadPostUniversalResult
{
  userView: USER_POSTS_TYPES,
  posts:GetUserPostsUniversalResponseModel[]
}

@Injectable({providedIn: 'root'})
export class PostDataService extends BaseService
{

  private readonly _onCudPostSubject: Subject<ICUDPostResult> = new Subject<ICUDPostResult>();
  private readonly _onLoadPostSubject: Subject<GetPostByIdDtoResponseModel> = new Subject<GetPostByIdDtoResponseModel>();
  private readonly _onLoadUserPostsUniversalSubject: Subject<ILoadPostUniversalResult> = new Subject<ILoadPostUniversalResult>();
  private readonly _onLoadPostCommentsCountSubject: Subject<number> = new Subject<number>();

  constructor(private _restService: PostRestService,
              serviceBus: GlobalBusService)
  {
    super(serviceBus)
  }

  public onLoadPostEvent(): Observable<GetPostByIdDtoResponseModel>
  {
    return this._onLoadPostSubject;
  }

  public onLoadUserPostsUniversalEvent(): Observable<ILoadPostUniversalResult>
  {
    return this._onLoadUserPostsUniversalSubject;
  }

  public onCudPostEvent(): Observable<ICUDPostResult>
  {
    return this._onCudPostSubject;
  }

  public onLoadPostCommentsCountEvent(): Observable<number>
  {
    return this._onLoadPostCommentsCountSubject;
  }

  public getUserPostsUniversal(item: GetUserPostsUniversalRequestModel): void
  {
    this.toDb(item,
              input => this._restService.getUserPostsUniversal(input),
              data =>
              {
                this._onLoadUserPostsUniversalSubject.next(<ILoadPostUniversalResult>{userView: item.selectedUserView, posts: !isEmptyArray(data) ? data : []});
              },
              `Can\t load user posts`);
  }

  public postCUD(item: PostCudRequestModel): void
  {
    this.toDb(item,
              input => this._restService.postCUD(input),
              (data: PostCudResponseModel[]) =>
              {
                showOperationResultMessages(this.serviceBus, data);
                item.postId = this.__getCudPostId(item, data);
                this._onCudPostSubject.next(<ICUDPostResult>{success: isAllOperationsSuccess(data), item: item, result: data});
              },
              `Can't modify post`);
  }

  public showHidePost(item: ShowHidePostRequestModel): void
  {
    this.toDb(item,
              input => this._restService.showHidePost(input),
              (data: ShowHidePostResponseModel[]) =>
              {
                showOperationResultMessages(this.serviceBus, data);
                this.serviceBus.sendEvent<IShowHidePostResult>(EActionType.ON_SHOW_HIDE_POST_ACTION, <IShowHidePostResult>{success: isAllOperationsSuccess(data), postId: item.postId, showPost: item.showPost});
                this.serviceBus.sendEvent<boolean>(EActionType.ON_REFRESH_ALL_DATA_ACTION, isAllOperationsSuccess(data));
              },
              `Can't show/hide post`);
  }

  public bookmarkPost(item: BookmarkPostRequestModel): void
  {
    this.toDb(item,
              input => this._restService.saveUnsavePost(input),
              (data: ShowHidePostResponseModel[]) =>
              {
                showOperationResultMessages(this.serviceBus, data);
                this.serviceBus.sendEvent<IBookmarkPostResult>(EActionType.ON_BOOKMARK_POST_ACTION, <IBookmarkPostResult>{success: isAllOperationsSuccess(data), postId: item.postId, bookmarkPost: item.bookmarkPost});
                this.serviceBus.sendEvent<boolean>(EActionType.ON_REFRESH_ALL_DATA_ACTION, isAllOperationsSuccess(data));
              },
              `Can't show/hide post`);
  }

  public deletePost(postId: number): void
  {
    this.toDb(postId,
              input => this._restService.postCUD(new PostCudRequestModel(OPERATION_TYPES.DELETE, input)),
              (data: OperationResult[]) =>
              {
                showOperationResultMessages(this.serviceBus, data);
                this.serviceBus.sendEvent(EActionType.ON_DELETE_POST_ACTION, <IDeletePostResult>{success: isAllOperationsSuccess(data), postId: postId});
                this.serviceBus.sendEvent<boolean>(EActionType.ON_REFRESH_ALL_DATA_ACTION, isAllOperationsSuccess(data));
              },
              `Can't delete post`);
  }

  public loadPost(item: GetPostByIdDtoRequestModel): void
  {
    this.toDb(item,
              input => this._restService.getPost(input),
              (data: GetPostByIdDtoResponseModel[]) =>
              {

                this._onLoadPostSubject.next(!isEmptyArray(data) ? data[0] : new GetPostByIdDtoResponseModel());
              },
              `Can't load post`);
  }

  public getPost(item: GetPostByIdDtoRequestModel): Observable<GetPostByIdDtoResponseModel[]>
  {
    return this._restService.getPost(item);
  }

  public getAllPostsByUser(name: string): Observable<PostModel[]>
  {
    return this._restService.getAllPostsByUser(name);
  }

  public loadCommentsCount(postId: number): void
  {
    this.toDb(postId,
              input => this._restService.getCommentsCount(input),
              data => this._onLoadPostCommentsCountSubject.next(!isEmptyNumberField(data) ? data : 0),
              `Can’t load the number of comments for a post`);
  }

  public getCommentsCount(postId: number): Observable<number>
  {
    return this._restService.getCommentsCount(postId);
  }

  public getPostsByChannel(channelId: number): Observable<PostModel[]>
  {
    return this._restService.getPostsByChannel(channelId);
  }

  private __getCudPostId(item: PostCudRequestModel, data: PostCudResponseModel[]): number
  {
    switch (item.operationType)
    {
      case OPERATION_TYPES.CREATE:
        return !isEmptyArray(data) ? data[0].id : null;
      default:
        return item.postId;
    }
  }
}
