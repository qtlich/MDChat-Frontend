import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {BaseComponent} from '../../common/components/base.component/base.component';
import {toNumber}      from '../../common/core/core.free.functions';
import {EActionType}   from '../../common/models/event.type';
import {GlobalBusService}                    from '../../common/services/global.bus.service';
import {GetAllCommentsRequestModel}          from './models/get.all.comments.request.model';
import {GetAllCommentsResponseModel}         from './models/get.all.comments.response.model';
import {ViewPostCommentsScreenDataModel}     from './models/view.post.comments.screen.data.model';
import {CommentDataService}                  from './services/comment.data.service';

@Component({
             selector:    'view-post-comments',
             templateUrl: './view-post-comments.component.html',
             styleUrls:   ['./view-post-comments.component.css']
           })
export class ViewCommentsComponent extends BaseComponent implements OnInit, OnDestroy
{
  @Input() postId: number;
  @Input() parentId: number;
  public sD: ViewPostCommentsScreenDataModel = new ViewPostCommentsScreenDataModel();

  public comments: GetAllCommentsResponseModel[];
  private _offset: number = 0;
  private _limit: number = 20;

  constructor(private commentService: CommentDataService,
              serviceBus: GlobalBusService)
  {
    super(serviceBus);
  }

  public ngOnInit(): void
  {
    super.ngOnInit();
    this.__loadComments();
  }

  protected onSubscribeData(): void
  {
    super.onSubscribeData();
    this.subscribe(this.serviceBus.onEvent(EActionType.SUCCESS_MODIFY_COMMENT, (data: boolean) => data && this.__loadComments()));
    this.subscribe(this.commentService.onLoadCommentsEvent().subscribe((data: GetAllCommentsResponseModel[]) => this.comments = data));
  }

  private __loadComments(): void
  {
    this.commentService.loadComments(new GetAllCommentsRequestModel(null,
                                                                    toNumber(this.postId),
                                                                    'new',
                                                                    this._offset,
                                                                    this._limit));
  }
}
