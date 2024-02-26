import {Injectable}                                                                                from '@angular/core';
import {ActivatedRoute, ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {LocalStorageService}                                                                       from 'ngx-webstorage';
import {Observable}                                                                                from 'rxjs';
import {redirectUrlStorageNameConst}                                                               from '../common/constants/core.free.constants';
import {toNumber}                                                                                  from '../common/core/core.free.functions';
import {AuthDataService}                                                                           from './shared/auth.data.service';

@Injectable({
              providedIn: 'root'
            })
export class AuthGuard implements CanActivate
{
  constructor(private authService: AuthDataService,
              private router: Router,
              private _localStorageService: LocalStorageService)
  {
  }

  canActivate(next: ActivatedRouteSnapshot,
              state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree
  {
    if(this.authService.isLoggedIn())
    {
      const channelId = toNumber(next.paramMap.get('channelid'));
      if(this.authService.isChannelModerator(channelId))
      {
        return true;
      }
      else
      {
        this.goToMainPage();
      }
    }
    else
    {
      this.goToLoginPage(state);
    }
    return true;
  }

  private goToLoginPage(state: RouterStateSnapshot): void
  {
    this._localStorageService.store(redirectUrlStorageNameConst, state.url);
    this.router.navigateByUrl('/login');
  }

  private goToMainPage(): void
  {
    this.router.navigateByUrl('/');
  }
}
