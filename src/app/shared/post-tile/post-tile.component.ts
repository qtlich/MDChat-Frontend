import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {PostService}                                 from '../post.service';
import {PostModel}                                          from '../post-model';
import {faBookmark, faComments, faShare, faEye, faEyeSlash} from '@fortawesome/free-solid-svg-icons';
import {Router}                                             from '@angular/router';
import {OperationResult}                             from '../../common/operation.result.model';
import {isEmptyArray}                                from '../../common/core.free.functions';
import {LazyLoadEvent, MessageService}               from 'primeng/api';
import {IconDefinition}                              from '@fortawesome/fontawesome-svg-core';

@Component({
             selector:      'app-post-tile',
             templateUrl:   './post-tile.component.html',
             styleUrls:     ['./post-tile.component.css'],
             encapsulation: ViewEncapsulation.None,
           })
export class PostTileComponent implements OnInit
{

  readonly faComments: IconDefinition = faComments;
  readonly faShare: IconDefinition = faShare;
  readonly faBookMark: IconDefinition = faBookmark;
  readonly faEyeSlash: IconDefinition = faEyeSlash;
  @Input() posts: PostModel[];

  constructor(private router: Router,
              private postService: PostService,
              private _messageService: MessageService)
  {
  }

  public loadPostsLazy(event: LazyLoadEvent)
  {
    console.log('LazyLoadEvent', event);
    //simulate remote connection with a timeout
    setTimeout(() =>
               {
                 //load data of required page
                 // let loadedCars = this.posts.slice(event.first, (event.first + event.rows));
                 //
                 // //populate page of virtual cars
                 // Array.prototype.splice.apply(this.virtualCars, [...[event.first, event.rows], ...loadedCars]);
                 //
                 // //trigger change detection
                 // this.virtualCars = [...this.virtualCars];
               }, 1000);
  }

  ngOnInit(): void
  {
  }

  goToPost(id: number): void
  {
    this.router.navigateByUrl('/view-post/' + id);
  }

  public deletePost(postId: number): void
  {
    this.postService
        .deletePost(postId)
        .subscribe((data: Array<OperationResult>) =>
                   {
                     if (!isEmptyArray(data))
                     {
                       data.map(item =>
                                {
                                  this._messageService.add({
                                                             severity: item.id > 0 ? 'success' : 'error',
                                                             summary:  item.id > 0 ? 'Success operation' : 'Error operation',
                                                             detail:   item.message
                                                           });
                                });
                     }
                     else
                     {
                       this._messageService.add({severity: 'error', summary: 'Error', detail: 'Can\'t delete post'});
                     }
                   });
  }


}
