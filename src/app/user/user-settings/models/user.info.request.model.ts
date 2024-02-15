/**
 * Get user info
 * API POST: /api/auth/getusersinfo
 */
export class UserInfoRequestModel
{
  /**
   *
   * @param userIdentifier userId or userName
   */
  constructor(public userIdentifier: string)
  {
  }
}
