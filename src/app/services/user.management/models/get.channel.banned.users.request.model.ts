/**
 * Get channel banned users
 * API POST /api/user-management/get-channel-banned-users
 */
export class GetChannelBannedUsersRequestModel
{
  constructor(public channelId?:number,
              public offset?:number,
              public limit?:number)
  {
  }
}
