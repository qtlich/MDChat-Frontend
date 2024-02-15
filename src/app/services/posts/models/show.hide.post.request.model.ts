/**
 * Show/hide post for user
 * API POST /posts/hide-post
 */
export class ShowHidePostRequestModel
{
  constructor(public postId?: number,
              public showPost?: boolean)
  {
  }
}
