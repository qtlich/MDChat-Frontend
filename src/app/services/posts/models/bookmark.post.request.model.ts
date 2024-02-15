/**
 * Bookmark post
 * /posts/bookmark
 */
export class BookmarkPostRequestModel
{
  constructor(public postId:number,
              public bookmarkPost:boolean)
  {
  }
}
