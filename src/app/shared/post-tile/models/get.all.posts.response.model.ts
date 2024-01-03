/**
 * POST posts/v1/all
 */
export class GetAllPostsResponseModel
{
  constructor(public postId?: number,
              public userId?: number,
              public postChannelId?: number,
              public channelType?: number,
              public channelName?: string,
              public channelDescription?: string,
              public postUseId?: number,
              public postUserName?: string,
              public postName?: string,
              public postDescription?: string,
              public postVoteCount?: number,
              public postCreated?: string,
              public postModified?: string,
              public postUrl?: string,
              public currentUserVoteType?: number,
              public postCountComments?: number,
              public postTimeAgo?: string)
  {
  }
}
