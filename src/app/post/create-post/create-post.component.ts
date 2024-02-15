import {Component, OnDestroy, OnInit}                                                          from '@angular/core';
import {Router}                                                                                from '@angular/router';
import {IconDefinition}                                                                        from '@fortawesome/fontawesome-svg-core';
import {faFire}                                                                                from '@fortawesome/free-solid-svg-icons';
import {SelectItem}                                                                            from 'primeng/api';
import {ChannelResponseModel}                                                                  from '../../channel/models/channel.response.model';
import {BaseComponent}                                                                         from '../../common/components/base.component/base.component';
import {errorToText, isEmptyArray, isEmptyStringField, isNullOrUndefined, showWarningMessages} from '../../common/core/core.free.functions';
import {OPERATION_TYPES}                                                                       from '../../common/core/enums/operation.types';
import {GlobalBusService}                                                                      from '../../common/services/global.bus.service';
import {ChannelRestService}                                                                    from '../../services/channels/channel.rest.service';
import {ICUDPostResult, PostDataService}                                                       from '../../services/posts/post.data.service';
import {CreatePostScreenDataModel}                                                             from './models/create.post.screen.data.model';
import {PostCudRequestModel}                                                                   from './models/post.cud.request.model';

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
              private postService: PostDataService,
              private channelService: ChannelRestService,
              serviceBus: GlobalBusService)
  {
    super(serviceBus);
    this.__loadDirectories();
  }

  private __loadDirectories(): void
  {
    this.channelService.getAllChannels().subscribe((data: ChannelResponseModel[]) =>
                                                   {
                                                     this.sD.channelItems = data.map(item => <SelectItem>{label: item.name, value: item.id, title: item.description});
                                                   }, error => this.showError(errorToText(error)));
  }

  public onCreatePostClick(): void
  {
    this.__isValidDataForSave() ? this.postService.postCUD(this.__prepareDataForSave()) : showWarningMessages(this.serviceBus, this.informationMessages);
  }

  protected onSubscribeData()
  {
    super.onSubscribeData();
    this.subscribe(this.postService.onCudPostEvent().subscribe((result: ICUDPostResult) => result.success && this.router.navigateByUrl('/')));
  }

  private __prepareDataForSave(): PostCudRequestModel
  {
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
