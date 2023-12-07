import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {AuthService} from './shared/auth.service';
import {LocalStorageService}         from 'ngx-webstorage';
import {redirectUrlStorageNameConst} from '../common/core.free.constants';

@Injectable({
              providedIn: 'root'
            })
export class AuthGuard implements CanActivate
{

  constructor(private authService: AuthService,
              private router: Router,
              private _localStorageService:LocalStorageService)
  {
  }

  canActivate(next: ActivatedRouteSnapshot,
              state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree
  {
    const isAuthenticated = this.authService.isLoggedIn();
    if (isAuthenticated)
    {
      return true;
    }
    else
    {
      this._localStorageService.store(redirectUrlStorageNameConst, state.url);
      this.router.navigateByUrl('/login');
    }
    return true;
  }
}
