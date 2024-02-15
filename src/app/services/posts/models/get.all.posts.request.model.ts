/**
 * POST posts/v1/all
 */
export class GetAllPostsRequestModel
{
  constructor(public sortMode?: string,
              public offset?: number,
              public limit?: number,
              // -1 don't trim
              public postNameMaxLength?: number,
              // -1 don't trim
              public postDescriptionMaxLength?: number)
  {
  }
}
