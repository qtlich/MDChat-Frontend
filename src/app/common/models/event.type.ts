interface IAction<T>
{
  payload: T
  type: EActionType,
}

export const enum EActionType
{
  EMPTY                                 = 'EMPTY', // null
  ON_CANCEL_CLICK                       = 'ON_CANCEL_CLICK', // type boolean
  ON_REFRESH_ALL_DATA_ACTION            = 'ON_REFRESH_ALL_DATA_ACTION', // type boolean
  SUCCESS_UPLOAD_FILE                   = 'SUCCESS_UPLOAD_FILE',// type FileUploadResult
  SHOW_INFORMATION_MESSAGE              = 'SHOW_INFORMATION_MESSAGE', // type Message
  ON_DELETE_COMMENT_ACTION              = 'ON_DELETE_COMMENT_ACTION', // type boolean
  ON_DELETE_POST_ACTION                 = 'ON_DELETE_POST_ACTION', // type IDeletePostResult
  SUCCESS_MODIFY_COMMENT                = 'SUCCESS_MODIFY_COMMENT', // type OnSuccessModifyCommentItem
  SUCCESS_MODIFY_CHANNEL                = 'SUCCESS_MODIFY_CHANNEL', // type OnSuccessModifyChannelItem
  ON_SHOW_HIDE_POST_ACTION              = 'ON_SHOW_HIDE_POST_ACTION', // type IShowHidePostResult
  ON_BOOKMARK_POST_ACTION               = 'ON_BOOKMARK_POST_ACTION', // type IBookmarkPostResult
  ON_LOGIN_ACTION                       = 'ON_LOGIN_ACTION', // type boolean
  ON_LOGOUT_ACTION                      = 'ON_LOGOUT_ACTION', // type boolean
  ON_VOTE_ACTION                        = 'ON_VOTE_ACTION', // type true
  ON_CHANGE_CHANNEL_SUBSCRIPTION_ACTION = 'ON_CHANGE_CHANNEL_SUBSCRIPTION_ACTION', // type boolean
}
