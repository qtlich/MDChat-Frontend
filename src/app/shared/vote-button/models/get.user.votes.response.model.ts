export class GetUserVotesResponseModel
{
  constructor(public postId?: number,
              public commentId?: number,
              public isVoted?: boolean,
              public countVotes?: number,
              public upVoted?: boolean,
              public downVoted?: boolean,
              public momentVoted?: string)
  {
  }
}
