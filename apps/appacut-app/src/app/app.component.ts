import { Component, NgZone } from '@angular/core';
import { Platform } from '@ionic/angular';
import { RoutingService } from '../core/routing.service';
import { App, URLOpenListenerEvent } from '@capacitor/app';
import { Router } from '@angular/router';
import { Stripe } from '@capacitor-community/stripe';
import { environment } from '../environments/environment';
import { SplashScreen } from '@capacitor/splash-screen';

import { Deploy } from 'cordova-plugin-ionic';
import { UpdateService } from '../core/update.service';
import { AnalyticsService } from '../core/analytics';
import { ConfigService } from '../core/config';

@Component({
  selector: 'shoppr-monorepo-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private routingService: RoutingService,
    private zone: NgZone,
    private router: Router,
    private updateService: UpdateService,
    private analyticsService: AnalyticsService,
    private configService: ConfigService
  ) {
    this.initializeApp();
  }


  async initializeApp() {
    Stripe.initialize({
      publishableKey: environment.stripePublicKey,
    });

    await this.platform.ready();
    await SplashScreen.hide();

    await this.routingService.initAppRouting();

    App.addListener('appUrlOpen', (event: URLOpenListenerEvent) => {
      this.zone.run(() => {
        console.log(`Got deep link: ${event.url}`);
        // Example url: https://beerswift.app/tabs/tab2
        // slug = /tabs/tab2
        const slug = event.url.split('.market').pop();
        if (slug) {
          console.log(`Navigating to slug ${slug}`)
          this.router.navigateByUrl(slug);
        }
        // If no match, do nothing - let regular routing
        // logic take over
      });
    });

    this.updateService.checkForBinaryUpdate();

    this.updateService.downloadUpdate();
  }
}
