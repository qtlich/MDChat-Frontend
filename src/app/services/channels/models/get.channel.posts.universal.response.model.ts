import {CommonUserPostResponse} from '../../posts/models/common/common.user.post.response';

/**
 * API POST: /channel/universal-channel-posts
 */
export class GetChannelPostsUniversalResponseModel extends CommonUserPostResponse
{
  public channelTypeString:string;
  constructor()
  {
    super();
  }
}
