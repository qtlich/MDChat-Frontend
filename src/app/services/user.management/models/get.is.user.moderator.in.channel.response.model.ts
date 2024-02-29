/**
 * Check if user is a channel moderator
 * API POST: /api/user-management/is-user-moderator
 */
export class GetIsUserModeratorInChannelResponseModel
{
  constructor(public userId?: number,
              public channelId?: number,
              public isModerator?: boolean)
  {
  }
}
