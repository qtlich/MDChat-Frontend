/**
 * POST posts/universal-comments
 */
export class GetUserCommentsUniverseResponseModel
{
  constructor(public commentId?: number,
              public commentParentId?: number,
              public channelId?: number,
              public channelName?: string,
              public postId?: number,
              public postName?: string,
              public postDescription?: string,
              public commentUserId?: number,
              public commentUserName?: string,
              public commentText?: string,
              public commentCreated?: string,
              public commentModified?: string,
              public commentVoteCount?: number,
              public commentsClosed?: boolean,
              public commentClaimsCount?: number,
              public commentTimeAgo?: string,
              public canEdit?: boolean,
              public canDelete?: boolean,
              public isDeleted?: boolean)
  {
  }
}
