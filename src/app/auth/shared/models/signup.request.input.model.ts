export class SignUpRequestInputModel
{
  constructor(public username?: string,
              public email?: string,
              public password?: string,
              public description?:string)
  {
  }
}
