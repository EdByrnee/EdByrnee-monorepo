import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root',
})
export class TutorialGuard implements CanActivate {
  constructor(private router: Router) {}

  async canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {

    const result = (await Preferences.get({ key: 'skipSplash' })).value;

    const isComplete = (result) ? true : false;
  
    if (!isComplete) {
      this.router.navigateByUrl('/splash');
    }

    return isComplete;
  }
}
