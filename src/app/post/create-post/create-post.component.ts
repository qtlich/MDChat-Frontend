import {Component, OnInit} from '@angular/core';
import {ChannelResponseModel} from '../../channel/models/channel.response.model';
import {Router} from '@angular/router';
import {PostService} from 'src/app/shared/post.service';
import {ChannelService} from '../../channel/channel.service';
import {throwError} from 'rxjs';
import {CreatePostPayload} from './create-post.payload';
import {MessageService, SelectItem} from "primeng/api";

@Component({
             selector: 'create-post',
             templateUrl: './create-post.component.html',
             styleUrls: ['./create-post.component.css']
           })
export class CreatePostComponent implements OnInit
{
  public selectedChannelId: number;
  public selectedUrl: string;
  public selectedDescription: string;
  public selectedName: string;
  public channelItems: Array<SelectItem> = [];

  constructor(private router: Router,
              private postService: PostService,
              private messageService: MessageService,
              private channelService: ChannelService)
  {
  }

  ngOnInit()
  {

    this.channelService.getAllChannels().subscribe((data: ChannelResponseModel[]) =>
                                                   {
                                                     this.channelItems = data.map(item => <SelectItem>{label: item.name, value: item.id, title: item.description});
                                                   }, error =>
                                                   {
                                                     throwError(error);
                                                   });
  }

  public createPost(): void
  {
    this.postService.createPost(this.__createPayload()).subscribe((data) =>
                                                                  {
                                                                    this.messageService.add({
                                                                                              severity: 'success',
                                                                                              summary: 'Success operation',
                                                                                              detail: `Channel: ${data.name} success created`
                                                                                            });
                                                                    this.router.navigateByUrl('/');
                                                                  }, error =>
                                                                  {
                                                                    throwError(error);
                                                                  })
  }

  private __isValidData(): boolean
  {
    return true;
  }

  public onDiscardClick(): void
  {
    this.router.navigateByUrl('/');
  }

  private __createPayload(): CreatePostPayload
  {
    return new CreatePostPayload(this.selectedChannelId,
                                 this.selectedName,
                                 this.selectedDescription,
                                 this.selectedUrl,
                                 false);
  }

}
