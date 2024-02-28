import {SelectItem}                           from 'primeng-lts';
import {ManageUserChannelBanningRequestModel} from '../../../../../services/user.management/models/manage.user.channel.banning.request.model';
import {SearchUsersResponseModel}             from '../../../../../services/user.management/models/search.users.response.model';

export class BanUserDialogScreenDataModel extends ManageUserChannelBanningRequestModel
{
  public filteredUsersFromServer: SearchUsersResponseModel[] = [];
  public banReasonsDD: SelectItem[] = [];
  public selectedUser: SearchUsersResponseModel;

  constructor()
  {
    super();
  }
}
