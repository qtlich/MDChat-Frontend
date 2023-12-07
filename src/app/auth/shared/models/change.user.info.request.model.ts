/**
 * API POST: /api/auth/changeuserinfo
 */
export class ChangeUserInfoRequestModel
{
  constructor(public userid?: number,
              public username?: string,
              public email?: string,
              public password?: string)
  {
  }
}
