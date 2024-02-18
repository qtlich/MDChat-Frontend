import {Component, Input, OnDestroy, OnInit}                                                from '@angular/core';
import {BaseComponent}                                                                      from '../../common/components/base.component/base.component';
import {isEmptyArray, isEmptyStringField, isNullOrUndefined, showWarningMessages, toNumber} from '../../common/core/core.free.functions';
import {OPERATION_TYPES}                                                                    from '../../common/core/enums/operation.types';
import {EActionType}                                                                        from '../../common/models/event.type';
import {GlobalBusService}       from '../../common/services/global.bus.service';
import {CommentCudRequestModel} from '../../services/comments/models/comment.cud.request.model';
import {CommentDataService}     from '../../services/comments/comment.data.service';
import {CreateCommentScreenDataModel} from './models/create.comment.screen.data.model';

export type OnSuccessModifyCommentItem = { success: boolean, item: CommentCudRequestModel };

@Component({
             selector:    'create-edit-comment',
             templateUrl: './create-comment.component.html',
             styleUrls:   ['./create-comment.component.css']
           })
export class CreateCommentComponent extends BaseComponent implements OnInit, OnDestroy
{
  @Input() postId: number;
  @Input() parentId: number;
  @Input() commentId: number;
  @Input() comment: string;
  @Input() mode: number = 0; // 0 - create, 1 - edit
  public sD: CreateCommentScreenDataModel = new CreateCommentScreenDataModel();

  constructor(private commentService: CommentDataService,
              serviceBus: GlobalBusService)
  {
    super(serviceBus);
  }

  public ngOnInit(): void
  {
    super.ngOnInit();
    if (this.mode == 1 && !isNullOrUndefined(this.comment))
    {
      this.sD.comment = this.comment;
    }
  }

  public onModifyCommentClick(): void
  {
    if (this.__isValidDataForSave())
    {
      this.commentService.modifyComment(this.__prepareDataForSave());
    }
    else
    {
      showWarningMessages(this.serviceBus, this.informationMessages);
    }
  }

  protected onSubscribeData(): void
  {
    super.onSubscribeData();
    this.subscribe(this.serviceBus.onEvent(EActionType.SUCCESS_MODIFY_COMMENT, (data: boolean) =>
    {
      this.comment = this.sD.comment = null;
    }))
  }

  private __prepareDataForSave(): CommentCudRequestModel
  {
    return new CommentCudRequestModel(this.mode == 0 ? OPERATION_TYPES.CREATE : OPERATION_TYPES.UPDATE,
                                      !isNullOrUndefined(this.commentId) ? toNumber(this.commentId) : null,
                                      !isNullOrUndefined(this.parentId) ? toNumber(this.parentId) : null,
                                      toNumber(this.postId),
                                      this.sD.comment);
  }

  private __isValidDataForSave(): boolean
  {
    this.clearInformationMessages();
    let i: number = 0;
    isNullOrUndefined(this.postId) && this.addInformationMessage(--i, 'postId can\'t be null');
    isEmptyStringField(this.sD.comment) && this.addInformationMessage(--i, 'Please fill in comment');
    return isEmptyArray(this.informationMessages);
  }
}
