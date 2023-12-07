import {Component, OnInit}       from '@angular/core';
import {AuthService}             from '../shared/auth.service';
import {Router}                  from '@angular/router';
import {SignUpRequestInputModel} from '../shared/models/signup.request.input.model';
import {isEmptyStringField}      from '../../common/core.free.functions';
import {MessageService}          from 'primeng/api';

@Component({
             selector:    'app-signup',
             templateUrl: './signup.component.html',
             styleUrls:   ['./signup.component.css']
           })
export class SignupComponent implements OnInit
{

  public userName: string;
  public email: string;
  public password: string;
  public confirmPassword: string;

  constructor(private _authService: AuthService,
              private _router: Router,
              private _messageService: MessageService)
  {
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
      this._messageService.add({severity:'error',detail: `Please input email`});
      return false;
    }
    if (isEmptyStringField(this.userName))
    {
      this._messageService.add({severity:'error',detail: `Please input username`});
      return false;
    }
    if (isEmptyStringField(this.password))
    {
      this._messageService.add({severity:'error',detail: `Please input password`});
      return false;
    }
    if (isEmptyStringField(this.confirmPassword))
    {
      this._messageService.add({severity:'error',detail: `Please input confirmation password`});
      return false;
    }
    if (this.password !== this.confirmPassword)
    {
      this._messageService.add({severity:'error',detail: `Passwords do not match`});
      return false;
    }
    return true;
  }

  ngOnInit()
  {
  }

  signup()
  {
    this._authService
        .signup(new SignUpRequestInputModel(this.userName,
                                            this.email,
                                            this.password))

        .subscribe(data =>
                   {
                     this._messageService.add({severity:'info',detail: data});
                     this._router.navigate(['/login'],
                                           {queryParams: {registered: 'true'}});
                   }, error =>
                   {
                     this._messageService.add({severity:'error',detail: 'Registration Failed! Please try again'});
                   });
  }
}
