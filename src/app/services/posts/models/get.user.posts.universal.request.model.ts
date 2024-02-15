import {USER_POSTS_TYPES} from '../enums/user.posts.types.enum';

/**
 * POST posts/user-posts-universal
 */
export class GetUserPostsUniversalRequestModel
{
  constructor(public userId: number,
              public selectedUserView:USER_POSTS_TYPES,
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
