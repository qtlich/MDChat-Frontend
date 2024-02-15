import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable}          from 'rxjs';
import {AuthDataService}     from './shared/auth.data.service';
import {LocalStorageService} from 'ngx-webstorage';
import {redirectUrlStorageNameConst} from '../common/constants/core.free.constants';

@Injectable({
              providedIn: 'root'
            })
export class AuthGuard implements CanActivate
{

  constructor(private authService: AuthDataService,
              private router: Router,
              private _localStorageService:LocalStorageService)
  {
  }

  canActivate(next: ActivatedRouteSnapshot,
              state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree
  {
    if (this.authService.isLoggedIn())
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
