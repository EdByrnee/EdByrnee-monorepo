import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { FirebaseAnalytics } from '@capacitor-community/firebase-analytics';

@Injectable({
  providedIn: 'root',
})
export class AnalyticsService {
  constructor(private router: Router) {
    // Update the screen everytime the route is changed
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.setPage(event.urlAfterRedirects);
      }
    });
  }

  setUser(user: any) {
    console.log('Setting user Id!');
    FirebaseAnalytics.setUserId(user);
  }

  logEvent(options: { name: string; params: object }) {
    FirebaseAnalytics.logEvent(options);
  }

  setPage(page: string) {
    FirebaseAnalytics.setScreenName({ screenName: page });
  }

  setUserProperty(options: { name: string; value: string }) {
    FirebaseAnalytics.setUserProperty(options);
  }
}
