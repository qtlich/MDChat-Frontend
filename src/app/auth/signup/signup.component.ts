import {Component, OnInit}                                                                                                             from '@angular/core';
import {Router}                                                                                                                        from '@angular/router';
import {BaseComponent}                                                                                                                 from '../../common/components/base.component/base.component';
import {errorToText, isAllOperationsSuccess, isEmptyArray, isEmptyStringField, showOperationResultMessages, showWarningMessages, trim} from '../../common/core/core.free.functions';
import {GlobalBusService}                                                                                                              from '../../common/services/global.bus.service';
import {AuthDataService}                                                                                                               from '../shared/auth.data.service';
import {SignUpRequestInputModel}                                                                                                       from '../shared/models/signup.request.input.model';

@Component({
             selector:    'app-signup',
             templateUrl: './signup.component.html',
             styleUrls:   ['./signup.component.css']
           })
export class SignupComponent extends BaseComponent implements OnInit
{
  public userName: string;
  public email: string;
  public password: string;
  public confirmPassword: string;
  public description: string;

  constructor(private _authService: AuthDataService,
              private _router: Router,
              serviceBus: GlobalBusService)
  {
    super(serviceBus);
  }

  public onSingUpClick(): void
  {
    this.__prepareInputData();
    if(this.__isValidInputData())
    {
      this.signup()
    }
    else
    {
      showWarningMessages(this.serviceBus, this.informationMessages);
    }
  }

  private __prepareInputData(): void
  {
    this.email = trim(this.email);
    this.userName = trim(this.userName);
    this.password = trim(this.password);
    this.confirmPassword = trim(this.confirmPassword);
    this.description = trim(this.description);
  }

  private __isValidInputData(): boolean
  {
    this.clearInformationMessages();
    let i: number;
    isEmptyStringField(this.email) && this.addInformationMessage(--i, `Please input email`);
    isEmptyStringField(this.userName) && this.addInformationMessage(--i, `Please input username`);
    isEmptyStringField(this.password) && this.addInformationMessage(--i, `Please input password`);
    isEmptyStringField(this.confirmPassword) && this.addInformationMessage(--i, `Please input confirmation password`);
    (this.password !== this.confirmPassword) && this.addInformationMessage(--i, `Passwords do not match`);
    return isEmptyArray(this.informationMessages);
  }

  public signup(): void
  {
    this._authService
        .signup(new SignUpRequestInputModel(!isEmptyStringField(this.userName) ? this.userName : null,
                                            !isEmptyStringField(this.email) ? this.email : null,
                                            !isEmptyStringField(this.password) ? this.password : null,
                                            !isEmptyStringField(this.description) ? this.description : null))
        .subscribe(data =>
                   {
                     showOperationResultMessages(this.serviceBus, data);
                     if(isAllOperationsSuccess(data))
                     {
                       this._router.navigate(['/login'],
                                             {queryParams: {registered: 'true'}});
                     }
                   }, error =>
                   {
                     this.showError(errorToText(error.error));
                     this.showError('Registration Failed! Please try again');
                   });
  }
}
