import {Component, OnDestroy, OnInit}                                                                                                                                  from '@angular/core';
import {ChannelResponseModel}                                                                                                                                          from '../../channel/models/channel.response.model';
import {Router}                                                                                                                                                        from '@angular/router';
import {PostService}                                                                                                                                                   from 'src/app/shared/post.service';
import {ChannelService}                                                                                                                                                from '../../channel/channel.service';
import {throwError}                                                                                                                                                    from 'rxjs';
import {MessageService, SelectItem}                                                                                                                                    from 'primeng/api';
import {PostCudRequestModel}                                                                                                                                           from './models/post.cud.request.model';
import {errorToText, isAllOperationsSuccess, isEmptyArray, isEmptyStringField, isNullOrUndefined, showWarningMessages, showErrorMessages, showOperationResultMessages} from '../../common/core.free.functions';
import {BaseComponent}                                                                                                                                                 from '../../common/components/base.component/base.component';
import {CreatePostScreenDataModel}                                                                                                                                     from './models/create.post.screen.data.model';
import {OPERATION_TYPES}                                                                                                                                               from '../../common/core/enums/operation.types';
import {OperationResult}                                                                                                                                               from '../../common/models/operation.result.model';
import {IconDefinition}                                                                                                                                                from '@fortawesome/fontawesome-svg-core';
import {faFire}                                                                                                                                                        from '@fortawesome/free-solid-svg-icons';

@Component({
             selector:    'create-post',
             templateUrl: './create-post.component.html',
             styleUrls:   ['./create-post.component.css']
           })
export class CreatePostComponent extends BaseComponent implements OnInit, OnDestroy
{

  public sD: CreatePostScreenDataModel = new CreatePostScreenDataModel();
  readonly faFire: IconDefinition = faFire;
  constructor(private router: Router,
              private postService: PostService,
              private messageService: MessageService,
              private channelService: ChannelService)
  {
    super(messageService);
    this.__loadDirectories();
  }

  private __loadDirectories(): void
  {
    this.channelService.getAllChannels().subscribe((data: ChannelResponseModel[]) =>
                                                   {
                                                     this.sD.channelItems = data.map(item => <SelectItem>{label: item.name, value: item.id, title: item.description});
                                                   }, error =>
                                                   {
                                                     this.messageService.add({severity: ''})
                                                     throwError(error);
                                                   });
  }

  public onCreatePostClick(): void
  {
    if (this.__isValidDataForSave())
    {
      this.postService.postCUD(this.__prepareDataForSave()).subscribe(data =>
                                                                      {
                                                                        showOperationResultMessages(this.messageService, data);
                                                                        if (isAllOperationsSuccess(data))
                                                                        {
                                                                          this.router.navigateByUrl('/');
                                                                        }
                                                                      },
                                                                      error => showErrorMessages(this.messageService, [new OperationResult(-1, errorToText(error))]));
    }
    else
    {
      showWarningMessages(this.messageService, this.informationMessages);
    }

  }

  private __prepareDataForSave(): PostCudRequestModel
  {
    console.log("this.sD.commentsLocked",this.sD.commentsLocked);
    return new PostCudRequestModel(OPERATION_TYPES.CREATE,
                                   null,
                                   !isNullOrUndefined(this.sD.channelId) ? this.sD.channelId : null,
                                   !isEmptyStringField(this.sD.postName) ? this.sD.postName : null,
                                   !isEmptyStringField(this.sD.postDescription) ? this.sD.postDescription : null,
                                   !isEmptyStringField(this.sD.url) ? this.sD.url : null,
                                   !isNullOrUndefined(this.sD.commentsLocked) ? this.sD.commentsLocked : false);
  }

  private __isValidDataForSave(): boolean
  {
    this.clearInformationMessages();
    let i: number = 0;
    isNullOrUndefined(this.sD.channelId) && this.addInformationMessage(--i, 'Please select channel');
    isEmptyStringField(this.sD.postName) && this.addInformationMessage(--i, 'Please fill in post name');
    isEmptyStringField(this.sD.postDescription) && this.addInformationMessage(--i, 'Please fill in post description');
    return isEmptyArray(this.informationMessages);
  }

  public onDiscardClick(): void
  {
    this.router.navigateByUrl('../');
  }
}
