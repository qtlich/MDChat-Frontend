/**
 * Get post by id
 * API POST /posts/get-post
 */
export class GetPostByIdDtoResponseModel
{
  constructor(public postId?: number,
              public channelId?: number,
              public channelType?: number,
              public channelName?: string,
              public channelDescription?: string,
              public userId?: number,
              public userName?: string,
              public postName?: string,
              public postDescription?: string,
              public url?: string,
              public votesCount?: number,
              public commentsCount?: number,
              public created?: string,
              public modified?: string,
              public createdTimeAgo?: string,
              public modifiedTimeAgo?: string,
              public commentsLocked?: boolean,
              public canDelete?: boolean,
              public canEdit?: boolean)
  {
  }
}
