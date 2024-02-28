/**
 * Check is user banned in channel
 * API POST: /api/user-management/is-user-banned
 */
export class GetIsUserBannedInChannelResponseModel
{
  constructor(public userId?:number,
              public channelId?:number,
              public isBanned?:boolean)
  {
  }
}
