/**
 * API POST: /channel/get-count-subscribers
 */
export class GetChannelCountSubscribersRequestModel
{
  constructor(public userId?:number,
              public channelId?:number)
  {
  }
}
