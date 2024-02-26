/**
 * POST /api/channel/get-description
 */
export class GetChannelDescriptionResponseModel
{
  constructor(public channelId?: number,
              public channelType?: number, // 0 - public, 1 - restricted, 2 - private
              public userId?: number,
              public userName?: string,
              public channelName?: string,
              public channelDescription?: string,
              public created?: string,
              public modified?: string,
              public countPosts?: number,
              public createdTimeAgo?: string,
              public isDeleted?: boolean,
              public isSubscribedOnChannel?: boolean,
              public hasAccessToChannel?: boolean,
              public isChannelModerator?: boolean,
              public canEdit?: boolean,
              public canDelete?: boolean)
  {
  }
}
