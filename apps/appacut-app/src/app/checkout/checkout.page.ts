import { Component, OnInit } from '@angular/core';
import {
  AlertController,
  LoadingController,
  ModalController,
  NavController,
} from '@ionic/angular';
import {
  DeliveryMethod,
  ICreateOrder,
  IDrop,
} from '@shoppr-monorepo/api-interfaces';
import { OrdersService } from '../../core/orders';
import { PaymentService } from '../../core/payment.service';
import * as confetti from 'canvas-confetti';
import * as uuid from 'uuid';
import { AnalyticsService } from '../../core/analytics';
import { AuthService } from '../../core/auth';
import { BasketService, IDiscount } from '../../core/basket.service';
import { Observable } from 'rxjs';
import { PromoCodeService } from '../../core/promo-code.service';

@Component({
  selector: 'shoppr-monorepo-checkout',
  templateUrl: './checkout.page.html',
  styleUrls: ['./checkout.page.scss'],
})
export class CheckoutPage implements OnInit {
  order: ICreateOrder;
  drop: IDrop;

  delieveryPrice: number;

  orderTotal: number;

  deliveryMethod: DeliveryMethod;

  loadingApplePay = false;

  demoMode$ = this.authService.demoMode$;

  _basketTotal$ = this.basketService.basketTotal$;

  _discounts$: Observable<IDiscount[]> = this.basketService._discounts$;

  applyPromoCode(code: string | number | null | undefined) {
    // this.promoCodeService.apply(code);
  }

  constructor(
    private modalCtrl: ModalController,
    private loadingController: LoadingController,
    private navController: NavController,
    private orderService: OrdersService,
    private alertController: AlertController,
    private paymentService: PaymentService,
    private analyticsService: AnalyticsService,
    private authService: AuthService,
    private basketService: BasketService,
    private promoCodeService: PromoCodeService
  ) {}

  why() {
    alert(
      'Purcahses are currently disabled till launch day! Check back in a few days!'
    );
  }

  async pay(isDemo: string) {
    console.log(`isDemo: ${isDemo}`);
    const newOrderUuid = uuid.v4();

    try {
      if (isDemo === 'true') {
        console.log(`Presenting apply pay in -demo mode`);
        await this.paymentService.demoPay(
          newOrderUuid,
          this.orderTotal,
          this.basketService.getDropUuids()
        );
      } else {
        console.log(`Presenting apply pay in non-demo mode`);
        this.loadingApplePay = true;
        await this.paymentService.presentApplePay(
          newOrderUuid,
          this.orderTotal,
          this.basketService.getDropUuids()
        );
        this.loadingApplePay = false;
      }
    } catch (err) {
      console.log(err);
      alert(
        'There was an error creating your order. Please contact support. You should recieve a refund shortly.'
      );
    }
  }

  clearModalsAndNavigate(uuid: string) {
    this.close();
    this.navController.navigateRoot('/tabs/tab1');
    this.navController.navigateForward('/view-order-driver/' + uuid);
  }

  close() {
    this.modalCtrl.dismiss(null, 'cancel', 'checkout');
  }

  ngOnInit() {
    this.analyticsService.logEvent({
      name: 'checkout_view',
      params: {
        // drop_ids: this.drop.uuid,
      },
    });
    this.paymentService.isApplePayAvailable();
  }
}
