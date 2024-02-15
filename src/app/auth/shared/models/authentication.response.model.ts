export class AuthenticationResponseModel
{
  constructor(public userid?: number,
              public authenticationToken?: string,
              public refreshToken?: string,
              public expiresAt?: Date,
              public username?: string)
  {
  }
}
