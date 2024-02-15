import {SelectItem}          from 'primeng-lts/api';
import {PostCudRequestModel} from '../../create-post/models/post.cud.request.model';

export class CreatePostScreenDataModel extends PostCudRequestModel
{
  public channelItems: SelectItem[] = [];

  constructor()
  {
    super();
  }
}
