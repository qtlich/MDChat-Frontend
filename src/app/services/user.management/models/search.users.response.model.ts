/**
 * Search avaliable users
 * API POST /api/user-management/search-users
 */
export class SearchUsersResponseModel
{
  constructor(public id?: number,
              public userName?: string,
              public description?: string,
              public email?: string,
              public created?: string,
              public modified?: string,
              public enabled?: boolean,
              public elapsedSinceRegistration?: string)
  {
  }
}
