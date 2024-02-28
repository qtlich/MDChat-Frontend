/**
 * manage user channel banning
 * API POST: /api/user-management/manage-user-channel-banning
 */
export class ManageUserChannelBanningRequestModel
{
  constructor(public userId?:number,
              public channelId?:number,
              public banReasonId?:number,
              public note?:string,
              public daysBanned?:number,
              public permanentBanned?:boolean)
  {
  }
}
