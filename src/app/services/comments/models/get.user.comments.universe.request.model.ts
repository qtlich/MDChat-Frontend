/**
 * POST posts/universal-comments
 */
export class GetUserCommentsUniverseRequestModel
{
  constructor(public userId?: number,
              public selectedUserView?: number,
              public sortMode?: string,
              public offset?: number,
              public limit?: number,
              // -1 don't trim
              public commentMaxTextLength?: number,
              // -1 don't trim
              public postNameMaxLength?: number,
              // -1 don't trim
              public postDescriptionMaxLength?: number)
  {
  }
}
