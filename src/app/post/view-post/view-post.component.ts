import {Component, OnDestroy, OnInit}                                          from '@angular/core';
import {ActivatedRoute, Router}                                                from '@angular/router';
import {faBookmark, faComments, faEdit, faEyeSlash, faReply, faShare, faTrash} from '@fortawesome/free-solid-svg-icons';
import {ConfirmationService}                                                   from 'primeng/api';
import {AuthDataService}                                                       from '../../auth/shared/auth.data.service';
import {OnSuccessModifyCommentItem}                                            from '../../comment/create-comment/create-comment.component';
import {CommentDataService}                                                    from '../../comment/view-post-comments/services/comment.data.service';
import {BaseComponent}                                                         from '../../common/components/base.component/base.component';
import {toNumber}                                                              from '../../common/core/core.free.functions';
import {EActionType}                                                           from '../../common/models/event.type';
import {GlobalBusService}                                                      from '../../common/services/global.bus.service';
import {GetPostByIdDtoRequestModel}                                            from '../../services/posts/models/get.post.by.id.dto.request.model';
import {GetPostByIdDtoResponseModel}                                           from '../../services/posts/models/get.post.by.id.dto.response.model';
import {IDeletePostResult, PostDataService}                                    from '../../services/posts/post.data.service';

@Component({
             selector:    'view-post',
             templateUrl: './view-post.component.html',
             styleUrls:   ['./view-post.component.css'],
             providers:   [ConfirmationService]
           })
export class ViewPostComponent extends BaseComponent implements OnInit, OnDestroy
{

  readonly faComments: any = faComments; //IconDefinition
  readonly faShare: any = faShare;
  readonly faBookMark: any = faBookmark;
  readonly faEyeSlash: any = faEyeSlash;
  public postId: number;
  public post: GetPostByIdDtoResponseModel;
  protected readonly faTrash = faTrash;
  protected readonly faReply = faReply;
  protected readonly faEdit = faEdit;

  constructor(private _postService: PostDataService,
              private _activateRoute: ActivatedRoute,
              private _commentService: CommentDataService,
              private _confirmationService: ConfirmationService,
              private _router: Router,
              serviceBus: GlobalBusService,
              authService: AuthDataService)
  {
    super(serviceBus, authService);
    this.postId = this._activateRoute.snapshot.params.id;
  }

  public ngOnInit(): void
  {
    super.ngOnInit();
    this.__loadPost();
  }

  public onEditClick(): void
  {

  }

  public onDeleteClick(): void
  {
    this._confirmationService.confirm({
                                        message: 'Are you sure that you want to delete post?',
                                        accept:  () => this._postService.deletePost(this.postId)
                                      });
  }

  protected onSubscribeData()
  {
    super.onSubscribeData();
    this.subscribe(this.serviceBus.onEvent(EActionType.SUCCESS_MODIFY_COMMENT, (data: OnSuccessModifyCommentItem) => this.__loadCommentsCount()));
    this.subscribe(this.serviceBus.onEvent(EActionType.ON_DELETE_POST_ACTION, (result: IDeletePostResult) => this._router.navigateByUrl('/')));
    this.subscribe(this._postService.onLoadPostEvent().subscribe((item: GetPostByIdDtoResponseModel) => this.post = item));
    this.subscribe(this._postService.onLoadPostCommentsCountEvent().subscribe((data: number) => this.post.commentsCount = data));
  }

  private __loadCommentsCount(): void
  {
    this._postService.loadCommentsCount(this.postId)
  }

  private __loadPost()
  {
    this._postService.loadPost(new GetPostByIdDtoRequestModel(toNumber(this.postId)))
  }
}
