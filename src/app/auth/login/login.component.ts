import {Component, OnInit}                            from '@angular/core';
import {LoginRequestPayload}                          from './login-request.payload';
import {AuthService}                                  from '../shared/auth.service';
import {ActivatedRoute, Router}                       from '@angular/router';
import {throwError}                                   from 'rxjs';
import {isEmptyStringField, isNullOrUndefined}        from '../../common/core.free.functions';
import {LocalStorageService}                          from 'ngx-webstorage';
import {redirectUrlStorageNameConst, singUpRouterUrl} from '../../common/core.free.constants';
import {MessageService}                               from 'primeng/api';

@Component({
             selector:    'app-login',
             templateUrl: './login.component.html',
             styleUrls:   ['./login.component.css']
           })
export class LoginComponent implements OnInit
{
  public userName: string;
  public password: string;
  private _redirectUrl: string;

  constructor(private _authService: AuthService,
              private _activatedRoute: ActivatedRoute,
              private _localStorageService: LocalStorageService,
              private _router: Router,
              private _messageService: MessageService)
  {
    this.__loadRedirectUrl();
  }

  private __loadRedirectUrl(): void
  {
    this._redirectUrl = this._localStorageService.retrieve(redirectUrlStorageNameConst);
  }

  public onLoginClick(): void
  {
    if (this.__isValidInputData())
    {
      this.login()
    }
  }

  ngOnInit(): void
  {
    this._activatedRoute
        .queryParams
        .subscribe(params =>
                   {
                     if (!isNullOrUndefined(params.registered) && params.registered === 'true')
                     {
                       this._messageService.add({severity: 'success', detail: 'Signup Successful'});
                     }
                   },
                   error => this._messageService.add({severity: 'error', detail: 'Signup Unsuccessful'}));
  }

  public login(): void
  {
    this._authService
        .login(new LoginRequestPayload(this.userName,
                                       this.password))
        .subscribe(data =>
                   {
                     if (!isEmptyStringField(this._redirectUrl) && this._redirectUrl != singUpRouterUrl)
                     {
                       this._router.navigateByUrl(this._redirectUrl);
                       this._localStorageService.clear(redirectUrlStorageNameConst)
                     }
                     else
                     {
                       this._router.navigateByUrl('');
                     }
                     this._messageService.add({severity: 'success', detail: 'Login success'});
                   }, error =>
                   {
                     throwError(error);
                   });
  }

  private __isValidInputData(): boolean
  {
    if (isEmptyStringField(this.userName))
    {
      this._messageService.add({severity: 'warn', detail: 'Please input username'});
      return false;
    }
    if (isEmptyStringField(this.password))
    {
      this._messageService.add({severity: 'warn', detail: 'Please input password'});
      return false;
    }
    return true;
  }

}
