import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AuthService } from '../core/auth';
import { DropsService } from '../core/drops';
import { MessageService } from '../core/messages';
import { OrdersService } from '../core/orders';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TabsPageRoutingModule } from './tabs/tabs-routing.module';
import { AuthorizationHttpInterceptor } from './app-http.interceptor';
import { RoutingService } from '../core/routing.service';
import { MapsService } from '../core/maps.service';
import { PaymentService } from '../core/payment.service';
import { AnalyticsService } from '../core/analytics';
import { UpdateService } from '../core/update.service';
import { NotificationService } from '../core/notifications';
import { ConfigService } from '../core/config';
import { BasketService } from '../core/basket.service';
import { DropItemsService } from '../core/drop-items';
import { DateAgoPipe } from './pipes/date-ago.pipe';

@NgModule({
  declarations: [AppComponent, DateAgoPipe],
  entryComponents: [],
  imports: [
    HttpClientModule,
    BrowserModule,
    IonicModule.forRoot({
      platform: {
        /** The default `desktop` function returns false for devices with a touchscreen.
         * This is not always wanted, so this function tests the User Agent instead.
         **/
        desktop: (win) => {
          const isMobile =
            /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
              win.navigator.userAgent
            );
          return !isMobile;
        },
      },
      scrollPadding: false,
      scrollAssist: true,
    }),
    AppRoutingModule,
    TabsPageRoutingModule,
    // NgxStripeModule.forRoot(environment.stripePublicKey),
  ],
  providers: [
    AnalyticsService,
    RoutingService,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    DropsService,
    DropItemsService,
    AuthService,
    ConfigService,
    OrdersService,
    MessageService,
    MapsService,
    NotificationService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthorizationHttpInterceptor,
      multi: true,
    },
    {
      provide: PaymentService,
      useClass: PaymentService,
    },
    UpdateService,
    BasketService
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
