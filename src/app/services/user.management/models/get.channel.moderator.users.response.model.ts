/**
 * Get channel moderator users
 * API POST /api/user-management/get-channel-moderator-users
 */
export class GetChannelModeratorUsersResponseModel
{
  constructor(public id?: number,
              public channelId?: number,
              public channelTypeId?: number,
              public channelName?: string,
              public userId?: number,
              public userName?: string,
              public authorId?: number,
              public authorName?: string,
              public created?: string,
              public createdTimeAgo?: string,
              public canViewChannel?: boolean,
              public canViewPosts?: boolean,
              public canCreatePosts?: boolean,
              public canComment?: boolean,
              public canVote?: boolean,
              public isChannelModerator?: boolean,
              public isAdministrator?: boolean)
  {
  }
}
