import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {PostService} from '../post.service';
import {PostModel} from '../post-model';
import {faComments} from '@fortawesome/free-solid-svg-icons';
import {Router} from '@angular/router';
import {OperationResult} from "../../common/operation.result.model";
import {isEmptyArray} from "../../common/core.free.functions";
import {MessageService} from "primeng/api";

@Component({
             selector: 'app-post-tile',
             templateUrl: './post-tile.component.html',
             styleUrls: ['./post-tile.component.css'],
             encapsulation: ViewEncapsulation.None,
           })
export class PostTileComponent implements OnInit
{

  faComments = faComments;
  @Input() posts: PostModel[];

  constructor(private router: Router,
              private postService: PostService,
              private messageService: MessageService)
  {
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
                                  this.messageService.add({
                                                            severity: item.id > 0 ? 'success' : 'error',
                                                            summary: item.id > 0 ? 'Success operation' : 'Error operation',
                                                            detail: item.message
                                                          });
                                });
                     }
                     else
                     {
                       this.messageService.add({
                                                 severity: 'error',
                                                 summary: 'Error',
                                                 detail: 'Can\'t delete post'
                                               });
                     }
                   });
  }
}
