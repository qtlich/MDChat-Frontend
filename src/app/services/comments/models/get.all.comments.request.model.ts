/**
 * Get all post comments
 * API POST: comments/by-post
 */
export class GetAllCommentsRequestModel
{
  constructor(public commentId?: number,
              public postId?: number,
              public sortMode?: string,
              public offset?: number,
              public limit?: number,
              public commentMaxLength: number = -1,
              public showDeleted: boolean     = false)
  {
  }
}
