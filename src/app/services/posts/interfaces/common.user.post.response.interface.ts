export interface CommonUserPostResponseInterface
{
  postId?: number,
  postChannelId?: number,
  channelType?: number,
  channelName?: string,
  channelDescription?: string,
  postUserId?: number,
  postUserName?: string,
  postName?: string,
  postDescription?: string,
  postVoteCount?: number,
  postCreated?: string,
  postModified?: string,
  postUrl?: string,
  currentUserVoteType?: number,
  postCountComments?: number,
  postTimeAgo?: string,
  lastVisited?: string,
  hidden?: boolean,
  saved?: boolean,
  canEdit?: boolean,
  canDelete?: boolean
}
