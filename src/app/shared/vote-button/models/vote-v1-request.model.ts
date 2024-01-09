import {VoteType} from '../vote-type';

/**
 * Vote on post or comment
 * API POST: /vote/v1/vote
 */
export class VoteV1RequestModel
{
  constructor(public postId?: number,
              public commentId?: number,
              public voteType?: VoteType)
  {
  }
}
