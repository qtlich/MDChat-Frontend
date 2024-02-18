import {Component, Input, OnDestroy, OnInit}                                              from '@angular/core';
import {faShare, faTrashAlt}                                                              from '@fortawesome/free-solid-svg-icons';
import {ConfirmationService, LazyLoadEvent, SelectItem}                                   from 'primeng-lts';
import {AuthDataService}                                                                  from '../../auth/shared/auth.data.service';
import {BaseComponent}                                                                    from '../../common/components/base.component/base.component';
import {isEmptyArray, isEmptyStringField, isNullOrUndefined, showOperationResultMessages} from '../../common/core/core.free.functions';
import {EActionType}                                                                      from '../../common/models/event.type';
import {GlobalBusService}                                                                 from '../../common/services/global.bus.service';
import {CommentDataService}                                                               from '../../services/comments/comment.data.service';
import {GetUserCommentsUniverseRequestModel}                                              from '../../services/comments/models/get.user.comments.universe.request.model';
import {GetUserCommentsUniverseResponseModel}                                             from '../../services/comments/models/get.user.comments.universe.response.model';
import {GetUserPostsUniversalResponseModel}                                               from '../../services/posts/models/get.user.posts.universal.response.model';
import {OnSuccessModifyCommentItem}                                                       from '../create-comment/create-comment.component';
import {USER_COMMENT_TYPES}                                                               from './enums/user.comment.types.enums';
import {UserCommentsScreenDataModel}                                                      from './models/user.comments.screen.data.model';

@Component({
             selector:    'user-comments',
             templateUrl: './user-comments.component.html',
             styleUrls:   ['./user-comments.component.css'],
             providers:   [ConfirmationService]
           })
export class UserCommentsComponent extends BaseComponent implements OnInit, OnDestroy
{
  public sD: UserCommentsScreenDataModel = new UserCommentsScreenDataModel();
  @Input() selectedView: USER_COMMENT_TYPES = USER_COMMENT_TYPES.NOT_SELECTED;
  @Input() showSortBar: boolean = true;
  readonly faShare: any = faShare;
  readonly faTrashAlt: any = faTrashAlt; //IconDefinition
  public comments: GetUserCommentsUniverseResponseModel[];
  public existingSortingDD: SelectItem[] = [{label: 'New', value: 'New', icon: 'pi pi-sort-amount-down'},
                                            // {label: 'Popular', value: 'Best', icon: 'pi pi-thumbs-up'},
                                            {label: 'Hot', value: 'Hot', icon: 'fa fa-eye-slash'},];
  public selectedSortBy: string = this.existingSortingDD[0].value;
  public selectedItem: GetUserCommentsUniverseResponseModel;
  public copyCommentId: number;
  private _first: number;
  private _rows: number;

  constructor(private commentService: CommentDataService,
              private confirmationService: ConfirmationService,
              serviceBus: GlobalBusService,
              authService: AuthDataService)
  {
    super(serviceBus, authService);
    this.selectedView = USER_COMMENT_TYPES.PROFILE_COMMENTS;
  }

  public onChangeSortMode(value: string): void
  {
    this.__clear();
    this.__refreshComments();
  }

  public loadPostsLazy(event: LazyLoadEvent)
  {
    console.error('loadPostsLazy', event);
    this.__load(event.first, event.rows);
  }

  public onRowSelect(item: GetUserPostsUniversalResponseModel): void
  {
  }

  public onDeleteClick(postId: number): void
  {
    this.confirmationService.confirm({
                                       message: 'Are you sure that you want to delete comment?',
                                       accept:  () => this.commentService.deleteComment(postId)
                                     });
  }

  public copyLink(link: any): void
  {
    this.showInfo('Link is copied=>', link);
  }

  protected onSubscribeData()
  {
    super.onSubscribeData();
    this.subscribe(this.commentService.onLoadUserCommentsUniversalEvent().subscribe((data: GetUserCommentsUniverseResponseModel[]) => this.comments = data));
    this.subscribe(this.serviceBus.onEvent(EActionType.SUCCESS_MODIFY_COMMENT, (data: OnSuccessModifyCommentItem) => this.__refreshComments()));
  }

  private __clear(): void
  {
    this.comments = [];
  }

  private __load(first: number, rows: number): void
  {
    this._first = first;
    this._rows = rows;
    this.__refreshComments();
  }

  private __refreshComments(): void
  {
    if(this.__isValidDataForRefresh())
    {
      this.commentService
          .loadUserCommentsUniversal(new GetUserCommentsUniverseRequestModel(null,
                                                                             1,
                                                                             !isEmptyStringField(this.selectedSortBy) ? this.selectedSortBy : 'New',
                                                                             this._first || 0,
                                                                             this._rows || 10,
                                                                             -1,
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
    (isNullOrUndefined(this.selectedView) || this.selectedView == USER_COMMENT_TYPES.NOT_SELECTED) && this.addInformationMessage(--i, `You should select needed view`)
    return isEmptyArray(this.informationMessages);
  }
}
