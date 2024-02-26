import {SearchChannelsResultModel} from '../../../channel/models/search-channels-result-model';
import {PostCudRequestModel}       from './post.cud.request.model';

export class CreatePostScreenDataModel extends PostCudRequestModel
{
  public selectedChannel: SearchChannelsResultModel;
  public filteredChannelsFromServer: SearchChannelsResultModel[];

  constructor()
  {
    super();
  }
}
