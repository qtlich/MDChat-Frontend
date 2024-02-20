/**
 * API POST: /channel/universal-channel-posts
 */
export class GetChannelPostsUniversalRequestModel
{
  constructor(public userId?:number,
              public channelId?:number,
              public channelName?:string,
              public selectedUserView?:number,
              public sortMode?:string,
              public offset?:number,
              public limit?:number,
              public postNameMaxLength:number = 100,
              public postDescriptionMaxLength:number=100)
  {
  }
}
