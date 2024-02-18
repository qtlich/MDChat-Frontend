import {Component, OnDestroy, OnInit}                                                                             from '@angular/core';
import {Router}                                                                                                   from '@angular/router';
import {AuthDataService}                                                                                          from '../../auth/shared/auth.data.service';
import {ChangeUserInfoRequestModel}                                                                               from '../../auth/shared/models/change.user.info.request.model';
import {BaseComponent}                                                                                            from '../../common/components/base.component/base.component';
import {errorToText, isAllOperationsSuccess, isEmptyArray, isEmptyStringField, showOperationResultMessages, trim} from '../../common/core/core.free.functions';
import {GlobalBusService}                                                                                         from '../../common/services/global.bus.service';
import {UserInfoRequestModel}                                                                                     from './models/user.info.request.model';
import {UserInfoResponseModel}                                                                                    from './models/user.info.response.model';

@Component({
             selector:    'user-settings',
             templateUrl: './user-settings.component.html',
             styleUrls:   ['./user-settings.component.css']
           })
export class UserSettingsComponent extends BaseComponent implements OnInit, OnDestroy
{
  public newUserName: string;
  public newEmail: string;
  public created: string;
  public modified: string;
  public newPassword: string;
  public newConfirmPassword: string;
  public description: string;
  public enabled: boolean;
  private _userId: number;

  constructor(private _router: Router,
              serviceBus: GlobalBusService,
              authService: AuthDataService)
  {
    super(serviceBus, authService);
    this.__loadUserParameters(this.userName);
  }

  public onChangeUserInfoClick(): void
  {
    this.__prepareInputData();
    if(this.__isValidInputData())
    {
      this.authService
          .changeUserInfo(this.__prepareDataForSave())
          .subscribe(data =>
                     {
                       showOperationResultMessages(this.serviceBus, data);
                       if(isAllOperationsSuccess(data))
                       {
                         this.__loadUserParameters(this.newUserName);
                       }
                     }, error => this.showError(`Can't change user info:` + errorToText(error)));
    }
    else
    {
      showOperationResultMessages(this.serviceBus, this.informationMessages);
    }
  }

  private __prepareInputData(): void
  {
    this.newUserName = trim(this.newUserName);
    this.newPassword = trim(this.newPassword);
    this.newConfirmPassword = trim(this.newConfirmPassword);
    this.description = trim(this.description);
  }

  private __prepareDataForSave(): ChangeUserInfoRequestModel
  {
    return new ChangeUserInfoRequestModel(this._userId,
                                          this.newUserName,
                                          this.newEmail,
                                          this.newPassword,
                                          this.description);
  }

  private __loadUserParameters(userName: string): void
  {
    this.__clearUserInfo();
    this.authService
        .getUserInfo(new UserInfoRequestModel(userName))
        .subscribe((data: Array<UserInfoResponseModel>) =>
                   {
                     if(!isEmptyArray(data))
                     {
                       const item: UserInfoResponseModel = data[0];
                       this._userId = item.id;
                       this.newUserName = item.username;
                       this.description = item.description;
                       this.newEmail = item.email;
                       this.created = item.created;
                       this.modified = item.modified;
                       this.enabled = item.enabled;
                     }
                   },
                   error => this.showError(`Can't retrieve user info: ` + errorToText(error)));
  }

  private __clearUserInfo(): void
  {
    this._userId = null;
    this.newUserName = null;
    this.newEmail = null;
    this.created = null;
    this.modified = null;
    this.enabled = null;
  }

  private __isValidInputData(): boolean
  {
    this.clearInformationMessages();
    let i: number = 0;
    isEmptyStringField(this.newEmail) && this.addInformationMessage(--i, `Please input email`);
    isEmptyStringField(this.newUserName) && this.addInformationMessage(--i, `Please input username`);
    isEmptyStringField(this.newPassword) && this.addInformationMessage(--i, `Please input password`);
    isEmptyStringField(this.newConfirmPassword) && this.addInformationMessage(--i, `Please input confirmation password`);
    (this.newPassword !== this.newConfirmPassword) && this.addInformationMessage(--i, `Passwords don't match`);
    return isEmptyArray(this.informationMessages);
  }
}
