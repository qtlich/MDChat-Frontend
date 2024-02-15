import {Component, OnInit}       from '@angular/core';
import {Router}                  from '@angular/router';
import {BaseComponent}                   from '../../common/components/base.component/base.component';
import {errorToText, isEmptyStringField} from '../../common/core/core.free.functions';
import {GlobalBusService}        from '../../common/services/global.bus.service';
import {AuthDataService}         from '../shared/auth.data.service';
import {SignUpRequestInputModel} from '../shared/models/signup.request.input.model';

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

  constructor(private _authService: AuthDataService,
              private _router: Router,
              serviceBus: GlobalBusService)
  {
    super(serviceBus);
  }

  public onSingUpClick(): void
  {
    if (this.__isValidInputData())
    {
      this.signup()
    }
  }

  private __isValidInputData(): boolean
  {
    if (isEmptyStringField(this.email))
    {
      this.showWarning(`Please input email`);
      return false;
    }
    if (isEmptyStringField(this.userName))
    {
      this.showWarning(`Please input username`);
      return false;
    }
    if (isEmptyStringField(this.password))
    {
      this.showWarning(`Please input password`);
      return false;
    }
    if (isEmptyStringField(this.confirmPassword))
    {
      this.showWarning(`Please input confirmation password`);
      return false;
    }
    if (this.password !== this.confirmPassword)
    {
      this.showWarning(`Passwords do not match`);
      return false;
    }
    return true;
  }

  public signup(): void
  {
    this._authService
        .signup(new SignUpRequestInputModel(this.userName,
                                            this.email,
                                            this.password))
        .subscribe(data =>
                   {
                     this.showMessages(data);
                     this._router.navigate(['/login'],
                                           {queryParams: {registered: 'true'}});
                   }, error =>
                   {
                    this.showError(errorToText(error.error));
                     this.showError('Registration Failed! Please try again');
                   });
  }
}
