import {ChannelResponseModel} from './channel.response.model';

export class SearchChannelsResultModel extends ChannelResponseModel
{
  constructor(public id?: number,
              public channelName?: string,
              public channelDescription?: number,
              public channelType?: number,
              public created?: string,
              public author?: string,
              public countPosts?: number)
  {
    super();
  }
}
