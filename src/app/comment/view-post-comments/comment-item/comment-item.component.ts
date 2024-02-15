import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {IconDefinition}                      from '@fortawesome/fontawesome-svg-core';
import {faEdit, faReply, faTrash}            from '@fortawesome/free-solid-svg-icons';
import {ConfirmationService}                 from 'primeng/api';
import {BaseComponent}                       from '../../../common/components/base.component/base.component';
import {GlobalBusService}                    from '../../../common/services/global.bus.service';
import {OnSuccessModifyCommentItem}          from '../../create-comment/create-comment.component';
import {GetAllCommentsResponseModel}         from '../models/get.all.comments.response.model';
import {CommentDataService}                  from '../services/comment.data.service';

@Component({
             selector:    'comment-item',
             templateUrl: './comment-item.component.html',
             styleUrls:   ['./comment-item.component.css'],
             providers:   [ConfirmationService]
           })
export class CommentItemComponent extends BaseComponent implements OnInit, OnDestroy
{
  @Input() item: GetAllCommentsResponseModel;
  public readonly: boolean = true;
  public needReplay: boolean = false;
  readonly faReply: IconDefinition = faReply;
  readonly faEdit: IconDefinition = faEdit;
  readonly faTrash: IconDefinition = faTrash;

  constructor(private commentService: CommentDataService,
              private confirmationService: ConfirmationService,
              serviceBus: GlobalBusService)
  {
    super(serviceBus);
  }

  public onReplayClick(): void
  {
    this.needReplay = !this.needReplay;
  }

  public onSuccessModifyItem(item: OnSuccessModifyCommentItem): void
  {
    console.log('onSuccessModifyItem(item: OnSuccessModifyCommentItem)=>',item);
    if (item.success)
    {
      this.readonly = true;
      this.item.comment = item.item.comment;
    }
  }

  public onEditClick(): void
  {
    this.readonly = !this.readonly;
  }

  public onDeleteClick(commentId: number): void
  {
    this.confirmationService.confirm({
                                       message: 'Are you sure that you want to delete this comment?',
                                       accept:  () => this.commentService.deleteComment(commentId)
                                     });
  }
}
