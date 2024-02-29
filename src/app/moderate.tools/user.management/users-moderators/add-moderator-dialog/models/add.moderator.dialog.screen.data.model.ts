import {ManageUserChannelBanningRequestModel} from '../../../../../services/user.management/models/manage.user.channel.banning.request.model';
import {ManageUserChannelPermissionsRequestModel} from '../../../../../services/user.management/models/manage.user.channel.permissions.request.model';
import {SearchUsersResponseModel}             from '../../../../../services/user.management/models/search.users.response.model';

export class AddModeratorDialogScreenDataModel extends ManageUserChannelPermissionsRequestModel
{
  public filteredUsersFromServer: SearchUsersResponseModel[] = [];
  public selectedUser: SearchUsersResponseModel;

  constructor()
  {
    super();
  }
}
