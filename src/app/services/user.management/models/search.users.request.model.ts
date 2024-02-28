/**
 * Search avaliable users
 * API POST /api/user-management/search-users
 */
export class SearchUsersRequestModel
{
  constructor(public userName?: string,
              public offset: number = 0,
              public limit: number  = 5)
  {
  }
}
