import {Component}                                                         from '@angular/core';
import {PostService}                                                       from '../post.service';
import {faBookmark, faComments, faEyeSlash, faShare, faTrashAlt}           from '@fortawesome/free-solid-svg-icons';
import {Router}                                                            from '@angular/router';
import {OperationResult}                                                   from '../../common/models/operation.result.model';
import {isAllOperationsSuccess, isEmptyArray, showOperationResultMessages} from '../../common/core.free.functions';
import {ConfirmationService, LazyLoadEvent, MessageService, SelectItem}    from 'primeng/api';
import {IconDefinition}                                                    from '@fortawesome/fontawesome-svg-core';
import {GetAllPostsRequestModel}                                           from './models/get.all.posts.request.model';
import {GetAllPostsResponseModel}                                          from './models/get.all.posts.response.model';
import {PostCudRequestModel}                                               from '../../post/create-post/models/post.cud.request.model';
import {OPERATION_TYPES}                                                   from '../../common/core/enums/operation.types';

@Component({
             selector:    'app-post-tile',
             templateUrl: './post-tile.component.html',
             styleUrls:   ['./post-tile.component.css'],
             providers:   [ConfirmationService]
           })
export class PostTileComponent
{
  readonly faComments: IconDefinition = faComments;
  readonly faShare: IconDefinition = faShare;
  readonly faBookMark: IconDefinition = faBookmark;
  readonly faEyeSlash: IconDefinition = faEyeSlash;
  readonly faTrashAlt: IconDefinition = faTrashAlt;
  public posts: GetAllPostsResponseModel[] = [];
  public existingSortingDD: SelectItem[] = [{label: 'Best', value: 'Best', icon: 'pi pi-check'},
                                            {label: 'Hot', value: 'Hot', icon: 'faEyeSlash'},
                                            {label: 'New', value: 'New', icon: 'faEyeSlash'},
  ];
  public selectedSortMode: string = 'Best';
  public selectedSortBy: string = this.existingSortingDD[0].value;
  private _offset: number;
  private _limit: number;

  constructor(private router: Router,
              private confirmationService: ConfirmationService,
              private postService: PostService,
              private _messageService: MessageService)
  {
    this.__clear();
  }

  public onChangeSortMode(value: string): void
  {
    this.selectedSortMode = value;
    this.__clear();
    this.__refreshPosts();
  }

  public onDeletePostClick(postId: number): void
  {
    this.confirmationService.confirm({
                                       message: 'Are you sure that you want to delete post?',
                                       accept:  () =>
                                                {
                                                  this.__deletePost(postId);
                                                }
                                     });
  }

  public loadPostsLazy(event: LazyLoadEvent)
  {
    console.log('loadPostsLazy', event);
    this.__load(event.first, event.rows);
  }

  goToPost(id: number): void
  {
    this.router.navigateByUrl('/view-post/' + id);
  }

  private __clear(): void
  {
    this._offset = 0;
    this._limit = 20;
    this.posts = [];
  }

  private __load(offset: number, limit: number): void
  {
    this._offset = offset;
    this._limit = limit;
    this.__refreshPosts();
  }

  private __refreshPosts(): void
  {
    console.log('this._offset', this._offset);
    console.log('this._limit', this._limit);
    this.postService
        .getAllPostsV1(new GetAllPostsRequestModel(this.selectedSortMode,
                                                   this._offset,
                                                   this._limit,
                                                   100,
                                                   100))
        .subscribe((data: GetAllPostsResponseModel[]) => this.posts = [...this.posts, ...data]);
  }

  private __deletePost(postId: number): void
  {
    this.postService
        .postCUD(new PostCudRequestModel(OPERATION_TYPES.DELETE,
                                         postId))
        .subscribe((data: Array<OperationResult>) =>
                   {
                     showOperationResultMessages(this._messageService, data);
                     isAllOperationsSuccess(data) && this.__deletePostFromList(postId);
                   });
  }

  private __deletePostFromList(postId: number): void
  {
    this.posts = !isEmptyArray(this.posts) ? this.posts.filter(item => item.postId != postId) : [];
  }

}
