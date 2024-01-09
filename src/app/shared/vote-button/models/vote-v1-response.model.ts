/**
 * Vote on post or comment
 * API POST: /vote/v1/vote
 */
export class VoteV1ResponseModel
{
  constructor(public postId?: number,
              public commentId?: number,
              public voteCount?: number,
              public lastVoteType?: number,
              public upVoted?: boolean,
              public downVoted?: boolean,
              public id?: number,
              public message?: string)
  {
  }
}
