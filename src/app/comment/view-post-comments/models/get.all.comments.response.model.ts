/**
 * Get all post comments
 * API POST: comments/by-post
 */
export class GetAllCommentsResponseModel
{
  public comments: GetAllCommentsResponseModel[];

  constructor(public id?: number,
              public parentId?: number,
              public comment?: string,
              public postId?: number,
              public userId?: number,
              public userName?: string,
              public voteCount?: number,
              public commentsClosed?: boolean,
              public created?: string,
              public createdTimeAgo?: string,
              public modified?: string,
              public modifiedTimeAgo?: string,
              public canDelete?: boolean,
              public canEdit?: boolean,
              public deleted?: boolean)
  {
  }
}
