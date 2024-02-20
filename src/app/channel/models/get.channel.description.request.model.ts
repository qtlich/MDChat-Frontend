/**
 * POST /api/channel/get-description
 */
export class GetChannelDescriptionRequestModel
{
  constructor(public channelId?: number,
              public showDeleted = false)
  {
  }

}
