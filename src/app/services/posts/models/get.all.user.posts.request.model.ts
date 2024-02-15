/**
 * POST posts/all-user-posts
 */
export class GetAllUserPostsRequestModel
{
  constructor(public userId: number,
              public sortMode?: string,
              public offset?: number,
              public limit?: number,
              // -1 don't trim
              public postNameMaxLength?: number,
              // -1 don't trim
              public postDescriptionMaxLength?: number)
  {
  }
}
