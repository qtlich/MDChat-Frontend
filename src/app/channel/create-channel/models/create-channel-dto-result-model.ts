export class CreateChannelDtoResultModel
{
  constructor(public id?: number,
              public name?: string,
              public description?: string,
              public channelType?: number,
              public numberOfPosts?: number)
  {
  }
}
