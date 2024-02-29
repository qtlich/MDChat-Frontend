/**
 * Check if user is a channel moderator
 * API POST: /api/user-management/is-user-moderator
 */
export class GetIsUserModeratorInChannelRequestModel
{
  constructor(public userId?:number,
              public channelId?:number)
  {
  }
}
