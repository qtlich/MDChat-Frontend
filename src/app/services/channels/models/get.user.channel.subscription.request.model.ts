/**
 * API POST channel/get-subscription
 */
export class GetUserChannelSubscriptionRequestModel
{
  constructor(public userId?:number,
              public channelId?:number)
  {
  }
}
