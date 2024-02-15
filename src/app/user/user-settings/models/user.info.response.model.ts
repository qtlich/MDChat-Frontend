/**
 * Get user info
 * API POST: /api/auth/getusersinfo
 */
export class UserInfoResponseModel
{
  constructor(public id?: number,
              public email?:string,
              public username?:string,
              public description?:string,
              public created?:string,
              public modified?:string,
              public enabled?:boolean)
  {
  }
}
