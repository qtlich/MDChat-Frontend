import {MANAGE_USER_PERMISSION_OPERATION_TYPES} from '../enums/manage.user.permission.operation.types.enum';

/**
 * Manage channel user permissions
 * API POST: /api/user-management/manage-channel-user-permissions
 */
export class ManageUserChannelPermissionsRequestModel
{
  constructor(public operationType?: MANAGE_USER_PERMISSION_OPERATION_TYPES,
              public userId?: number,
              public channelId?: number,
              public isAdministrator?: boolean,
              public isChannelModerator?: boolean,
              public canViewChannel?: boolean,
              public canViewPosts?: boolean,
              public canCreatePosts?: boolean,
              public canComment?: boolean,
              public canVote?: boolean)
  {
  }
}
