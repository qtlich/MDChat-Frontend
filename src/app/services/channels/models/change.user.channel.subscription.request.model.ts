/**
 * API POST /channel/change-subscription
 */
export class ChangeUserChannelSubscriptionRequestModel
{
  constructor(public userId?:number,
              public channelId?:number)
  {
  }
}
