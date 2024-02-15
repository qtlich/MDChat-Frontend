import {CommonUserPostResponseInterface} from '../../interfaces/common.user.post.response.interface';

export class CommonUserPostResponse implements CommonUserPostResponseInterface
{
  constructor(public postId?: number,
              public postChannelId?: number,
              public channelType?: number,
              public channelName?: string,
              public channelDescription?: string,
              public postUserId?: number,
              public postUserName?: string,
              public postName?: string,
              public postDescription?: string,
              public postVoteCount?: number,
              public postCreated?: string,
              public postModified?: string,
              public postUrl?: string,
              public currentUserVoteType?: number,
              public postCountComments?: number,
              public postTimeAgo?: string,
              public lastVisited?: string,
              public hidden?: boolean,
              public saved?: boolean,
              public canEdit?: boolean,
              public canDelete?: boolean)
  {
  }
}
