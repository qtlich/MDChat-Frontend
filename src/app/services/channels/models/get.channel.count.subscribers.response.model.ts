/**
 * API POST: /channel/get-count-subscribers
 */
export class GetChannelCountSubscribersResponseModel
{
  constructor(public channelId?:number,
              public countSubscribers?:number)
  {
  }
}
