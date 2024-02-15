import {DOCUMENT}                        from '@angular/common';
import {Inject, Injectable}              from '@angular/core';
import {LocalStorageService}             from 'ngx-webstorage';
import {isEmptyArray, isNullOrUndefined} from '../common/core/core.free.functions';

export interface ThemeItem
{
  name: string;
  path: string;
  image: string;
}

export const themes: ThemeItem[] = [{name: 'Luna amber', path: 'luna-amber', image: 'assets/images/themes/luna-amber.png'},
                                    {name: 'Luna blue', path: 'luna-blue', image: 'assets/images/themes/luna-blue.png'},
                                    {name: 'Luna green', path: 'luna-green', image: 'assets/images/themes/luna-green.png'},
                                    {name: 'Luna pink', path: 'luna-pink', image: 'assets/images/themes/luna-pink.png'},
                                    {name: 'Nova colored', path: 'nova-colored', image: 'assets/images/themes/nova.png'},
                                    {name: 'Nova dark', path: 'nova-dark', image: 'assets/images/themes/nova-alt.png'},
                                    {name: 'Nova light', path: 'nova-light', image: 'assets/images/themes/nova-vue.png'},
                                    {name: 'Rhea', path: 'rhea', image: 'assets/images/themes/rhea.png'}];

@Injectable({providedIn: 'root',})
export class ThemeService
{
  private _existingThemes: ThemeItem[] = themes;
  private _selectedTheme: ThemeItem;
  private _storageThemeKey = 'selectedTheme';

  constructor(@Inject(DOCUMENT) private document: Document,
              private _localStorageService: LocalStorageService)
  {
    this.__loadSavedTheme();
  }

  public switchTheme(themePath: string): void
  {
    this._selectedTheme = this.__findThemeElement(themePath);
    const themeLink = this.document.getElementById('app-theme') as HTMLLinkElement;
    if (themeLink)
    {
      themeLink.href = window.location.origin + '/assets/resources/themes/' + themePath + '/theme.css';
    }
    this.__saveSelectedThemeToStorage();
  }

  private __findThemeElement(themePath: string): ThemeItem
  {
    const finded: ThemeItem[] = this._existingThemes.filter((item) => item.path == themePath);
    return !isEmptyArray(finded) ? finded[0] : this._existingThemes[0];
  }

  private __loadSavedTheme(): void
  {
    const item: ThemeItem = <ThemeItem>this._localStorageService.retrieve(this._storageThemeKey);
    this.switchTheme(!isNullOrUndefined(item) ? item.path : this._existingThemes[0].path);
  }

  private __saveSelectedThemeToStorage(): void
  {
    this._localStorageService.store(this._storageThemeKey, this._selectedTheme);
  }
}
