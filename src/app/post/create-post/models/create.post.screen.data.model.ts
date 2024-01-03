import {PostCudRequestModel} from './post.cud.request.model';
import {SelectItem}          from 'primeng/api';

export class CreatePostScreenDataModel extends PostCudRequestModel
{
  public channelItems: Array<SelectItem> = [];
  constructor()
  {
    super();
  }
}
