export class GetUserVotesResponseModel
{
  constructor(public countVotes?: number,
              public upVote?:boolean,
              public downVote?:boolean)
  {
  }
}
