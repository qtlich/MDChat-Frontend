export class SearchChannelsInputModel
{
  constructor(public userId?: number,
              public channelName?: string,
              public maxNameLength: number        = 100,
              public maxDescriptionLength: number = 100,
              public limit: number                = 20)
  {
  }
}
