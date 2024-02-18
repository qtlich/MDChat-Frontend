import {Injectable}                           from '@angular/core';
import {Observable, ReplaySubject, Subject}   from 'rxjs';
import {isAllOperationsSuccess, isEmptyArray} from '../../common/core/core.free.functions';
import {OPERATION_TYPES}                      from '../../common/core/enums/operation.types';
import {EActionType}                          from '../../common/models/event.type';
import {BaseService}                          from '../../common/services/base.service';
import {GlobalBusService}                     from '../../common/services/global.bus.service';
import {CommentRestService}                   from './comment.rest.service';
import {CommentCudRequestModel}               from './models/comment.cud.request.model';
import {GetAllCommentsRequestModel}           from './models/get.all.comments.request.model';
import {GetAllCommentsResponseModel}          from './models/get.all.comments.response.model';
import {GetUserCommentsUniverseRequestModel}  from './models/get.user.comments.universe.request.model';
import {GetUserCommentsUniverseResponseModel} from './models/get.user.comments.universe.response.model';

@Injectable({
              providedIn: 'root'
            })
export class CommentDataService extends BaseService
{
  private _comments: GetAllCommentsResponseModel[] = [];
  private _tree: GetAllCommentsResponseModel[] = [];
  private readonly _onLoadCommentTreeSubject: ReplaySubject<GetAllCommentsResponseModel[]> = new ReplaySubject<GetAllCommentsResponseModel[]>(1);
  private readonly _onLoadUserCommentsUniversalSubject: Subject<GetUserCommentsUniverseResponseModel[]> = new Subject<GetUserCommentsUniverseResponseModel[]>();

  constructor(private _restService: CommentRestService,
              serviceBus: GlobalBusService)
  {
    super(serviceBus);
  }

  public onLoadUserCommentsUniversalEvent(): Observable<GetUserCommentsUniverseResponseModel[]>
  {
    return this._onLoadUserCommentsUniversalSubject;
  }

  public loadComments(item: GetAllCommentsRequestModel): void
  {
    this.__loadComments(item);
  }

  public onLoadCommentsEvent(): Observable<GetAllCommentsResponseModel[]>
  {
    return this._onLoadCommentTreeSubject;
  }

  private __buildTree(comments: GetAllCommentsResponseModel[]): GetAllCommentsResponseModel[]
  {
    const commentMap: Map<number, GetAllCommentsResponseModel> = new Map<number, GetAllCommentsResponseModel>();
    const tree: GetAllCommentsResponseModel[] = [];
    if(!isEmptyArray(comments))
    {
      // Create map for quick access to comments by their id
      comments.forEach((comment: GetAllCommentsResponseModel) =>
                       {
                         commentMap.set(comment.id, {...comment, comments: []});
                       });
      // Create tree
      commentMap.forEach((comment: GetAllCommentsResponseModel) =>
                         {
                           if(comment.parentId !== null && commentMap.has(comment.parentId))
                           {
                             commentMap.get(comment.parentId).comments.push(comment);
                           }
                           else
                           {
                             tree.push(comment);
                           }
                         });
    }
    return tree;
  }

  public loadUserCommentsUniversal(item: GetUserCommentsUniverseRequestModel): void
  {
    this.toDb<GetUserCommentsUniverseRequestModel, GetUserCommentsUniverseResponseModel[]>(item,
                                                                                           input => this._restService.getUserCommentsUniversal(input),
                                                                                           (data: GetUserCommentsUniverseResponseModel[]) =>
                                                                                           {
                                                                                             this._onLoadUserCommentsUniversalSubject.next(!isEmptyArray(data)?data:[]);
                                                                                           },
                                                                                           `Can't load user comments`);
  }

  public deleteComment(commentId: number): void
  {
    this.__commentCUD(new CommentCudRequestModel(OPERATION_TYPES.DELETE,
                                                 commentId));
  }

  public modifyComment(item: CommentCudRequestModel): void
  {
    this.__commentCUD(item);
  }

  private __commentCUD(item: CommentCudRequestModel): void
  {
    this.toDb(item,
              input => this._restService.commentCUD(input),
              data =>
              {
                this.serviceBus.showMessages(data);
                this.serviceBus.sendEvent(EActionType.SUCCESS_MODIFY_COMMENT, isAllOperationsSuccess(data));
              },
              `Can't update comment`)
  }

  private __loadComments(item: GetAllCommentsRequestModel): void
  {
    this.toDb(item,
              input => this._restService.getAllPostComments(input),
              data =>
              {
                this._comments = !isEmptyArray(data) ? data : [];
                this._tree = this.__buildTree(data);
                this._onLoadCommentTreeSubject.next(this._tree);
              }, `Can't load comments`);
  }
}
