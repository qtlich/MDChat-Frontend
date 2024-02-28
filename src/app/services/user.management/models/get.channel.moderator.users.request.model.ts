/**
 * Get channel moderator users
 * API POST /api/user-management/get-channel-moderator-users
 */
export class GetChannelModeratorUsersRequestModel
{
  constructor(public channelId?: number,
              public offset?: number,
              public limit?: number)
  {
  }
}
