export class VoteRequestPayload
{
  constructor(public voteType?: number,
              public postId?: number,
              public commentId?: number)
  {
  }
}
