import {Component, OnInit}                                  from '@angular/core';
import {ActivatedRoute, Router}                             from '@angular/router';
import {LocalStorageService}                                from 'ngx-webstorage';
import {BaseComponent}                                      from '../../common/components/base.component/base.component';
import {redirectUrlStorageNameConst, singUpRouterUrl}       from '../../common/constants/core.free.constants';
import {errorToText, isEmptyStringField, isNullOrUndefined} from '../../common/core/core.free.functions';
import {GlobalBusService}    from '../../common/services/global.bus.service';
import {AuthDataService}     from '../shared/auth.data.service';
import {LoginRequestPayload} from './login-request.payload';

@Component({
             selector:    'app-login',
             templateUrl: './login.component.html',
             styleUrls:   ['./login.component.css']
           })
export class LoginComponent extends BaseComponent implements OnInit
{
  public userName: string;
  public password: string;
  private _redirectUrl: string;

  constructor(private _authService: AuthDataService,
              private _activatedRoute: ActivatedRoute,
              private _localStorageService: LocalStorageService,
              private _router: Router,
              serviceBus: GlobalBusService)
  {
    super(serviceBus);
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

  public ngOnInit(): void
  {
    this._activatedRoute
        .queryParams
        .subscribe(params =>
                   {
                     if (!isNullOrUndefined(params.registered) && params.registered === 'true')
                     {
                       this.showSuccess(`Signup Successful`);
                     }
                   },
                   error => this.showError('Signup Unsuccessful'));
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
                     this.showSuccess('Login success');
                   }, error =>
                   {
                     this.showError(errorToText(error));
                   });
  }

  private __isValidInputData(): boolean
  {
    if (isEmptyStringField(this.userName))
    {
      this.showWarning('Please input username');
      return false;
    }
    if (isEmptyStringField(this.password))
    {
      this.showWarning('Please input password');
      return false;
    }
    return true;
  }

}
