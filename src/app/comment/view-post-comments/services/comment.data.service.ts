import {Injectable}                           from '@angular/core';
import {Observable, ReplaySubject, Subject}   from 'rxjs';
import {isAllOperationsSuccess, isEmptyArray} from '../../../common/core/core.free.functions';
import {OPERATION_TYPES}                      from '../../../common/core/enums/operation.types';
import {EActionType}                          from '../../../common/models/event.type';
import {BaseService}                          from '../../../common/services/base.service';
import {GlobalBusService}                     from '../../../common/services/global.bus.service';
import {OnSuccessModifyCommentItem}           from '../../create-comment/create-comment.component';
import {CommentCudRequestModel}               from '../models/comment.cud.request.model';
import {CommentPayload}                       from '../models/comment.payload';
import {GetAllCommentsRequestModel}           from '../models/get.all.comments.request.model';
import {GetAllCommentsResponseModel}          from '../models/get.all.comments.response.model';
import {CommentRestService}                   from './comment.rest.service';

@Injectable({
              providedIn: 'root'
            })
export class CommentDataService extends BaseService
{
  private _comments: GetAllCommentsResponseModel[] = [];
  private _tree: GetAllCommentsResponseModel[] = [];
  private readonly _onLoadCommentTreeSubject: ReplaySubject<GetAllCommentsResponseModel[]> = new ReplaySubject<GetAllCommentsResponseModel[]>(1);
  private readonly _onLoadUserCommentsSubject: ReplaySubject<CommentPayload[]> = new ReplaySubject<CommentPayload[]>(1);

  constructor(private _restService: CommentRestService,
              serviceBus: GlobalBusService)
  {
    super(serviceBus);
  }
  public onLoadUserCommentsEvent():Observable<CommentPayload[]>
  {
    return this._onLoadUserCommentsSubject;
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
    const commentMap = new Map<number, GetAllCommentsResponseModel>();
    const tree: GetAllCommentsResponseModel[] = [];
    if (!isEmptyArray(comments))
    {
      // Create map for quick access to comments by their id
      comments.forEach(comment =>
                       {
                         commentMap.set(comment.id, {...comment, comments: []});
                       });

      // Create tree
      commentMap.forEach(comment =>
                         {
                           if (comment.parentId !== null && commentMap.has(comment.parentId))
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
  public getAllCommentsByUser(userName:string):void
  {
    this.toDb(userName,
              input=>this._restService.getAllCommentsByUser(input),
              (data:CommentPayload[])=>{},
              `Can't load user comments`);
  }
  public deleteComment(commentId:number):void
  {
    this.__commentCUD(new CommentCudRequestModel(OPERATION_TYPES.DELETE,
                                                 commentId));
  }
  public modifyComment(item:CommentCudRequestModel):void
  {
    this.__commentCUD(item);
  }

  private __commentCUD(item: CommentCudRequestModel): void
  {
    console.log('__commentCUD',item);
    this.toDb(item,
              input => this._restService.commentCUD(input),
              data =>
              {
                this.serviceBus.showMessages(data);
                console.log('private __commentCUD(item: CommentCudRequestModel): void=>',data);
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
