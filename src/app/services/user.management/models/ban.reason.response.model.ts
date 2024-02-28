/**
 * Get ban reasons
 * API GET: /api/user-management/banreasons/get
 */
export class BanReasonResponseModel
{
  constructor(public id?:number,
              public name?:string)
  {
  }
}
