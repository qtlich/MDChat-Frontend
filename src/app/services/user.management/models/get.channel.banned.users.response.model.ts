/**
 * Get channel banned users
 * API POST /api/user-management/get-channel-banned-users
 */
export class GetChannelBannedUsersResponseModel
{
  constructor(public id?: number,
              public channelId?: number,
              public channelTypeId?: number,
              public channelName?: string,
              public userId?: number,
              public userName?: string,
              public banReasonId?: number,
              public banReasonName?: string,
              public note?: string,
              public daysBanned?: number,
              public permanentBanned?: boolean,
              public authorId?: number,
              public authorName?: string,
              public created?: string)
  {
  }
}
