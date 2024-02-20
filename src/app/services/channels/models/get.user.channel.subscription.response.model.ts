/**
 * API POST channel/get-subscription
 */
export class GetUserChannelSubscriptionResponseModel
{
  constructor(public userId?: number,
              public channelId?: number,
              public isSubscribed?: boolean)
  {
  }
}
