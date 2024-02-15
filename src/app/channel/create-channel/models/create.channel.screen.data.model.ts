import {ChannelCudRequestModel} from '../../../services/channels/models/channel.cud.request.model';

export class CreateChannelScreenDataModel extends ChannelCudRequestModel
{
  public remaining: number;

  public channelTypeString: string = 'public';

  constructor()
  {
    super();
  }
}
