import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  Stripe,
  ApplePayEventsEnum,
  ShippingContact,
  DidSelectShippingContact,
} from '@capacitor-community/stripe';
import { DeliveryMethod, ICreateOrder } from '@shoppr-monorepo/api-interfaces';
import { first } from 'rxjs';
import { environment } from '../environments/environment';
import { OrdersService } from './orders';
import {
  AlertController,
  LoadingController,
  ModalController,
  NavController,
} from '@ionic/angular';
import * as confetti from 'canvas-confetti';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  environment = environment;

  constructor(
    private http: HttpClient,
    private ordersService: OrdersService,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private navController: NavController,
    private modalCtrl: ModalController
  ) {}

  contactDetails: ShippingContact;

  public async demoPay(
    newOrderUuid: string,
    orderTotal: number,
    dropUuid: string,
    deliveryMethod: DeliveryMethod,
    sellerUuid: string
  ): Promise<void> {
    const creatingOrder = await this.loadingController.create({
      message: 'Creating order...',
    });
    await creatingOrder.present();

    console.log(`Demo pay transaction approved for ${orderTotal}`);
    const createOrderObj = this.getDemoCreateOrderObj(
      newOrderUuid,
      deliveryMethod,
      dropUuid
    );

    // Happy path
    return this.createOrder(
      creatingOrder,
      createOrderObj,
      orderTotal,
      deliveryMethod,
      sellerUuid
    ).then((ok) => {
      this.clearModalsAndNavigate(newOrderUuid);
      this.fireConfetti1();
    });
  }

  public async presentApplePay(
    newOrderUuid: string,
    orderTotal: number,
    dropUuid: string,
    deliveryMethod: DeliveryMethod,
    sellerUuid: string
  ): Promise<void> {
    if (this.isApplePayAvailable() === undefined) return; // disable to use Google Pay return;

    console.log(`Adding listener (DidSelectShippingContact)`);
    await Stripe.addListener(
      ApplePayEventsEnum.DidCreatePaymentMethod,
      async (data: DidSelectShippingContact) => {
        console.log('ApplePayEventsEnum.DidCreatePaymentMethod');
        console.log(data);
        const contact: any = data.contact;
        this.contactDetails = contact[0];
        console.log(`Stored contact details is now`);
        console.log(this.contactDetails);
      }
    );

    console.log(`Adding listeners (ApplePayEventsEnum)`);
    await Stripe.addListener(ApplePayEventsEnum.Completed, async () => {
      console.log('ApplePayEventsEnum.ApplePayEventsEnum');
      const creatingOrder = await this.loadingController.create({
        message: 'Creating order...',
      });
      await creatingOrder.present();

      console.log(`Apple pay transaction approved for ${orderTotal}`);
      console.log(`Stored contact details BEING USED`);
      console.log(this.contactDetails);
      const createOrderObj: ICreateOrder = {
        uuid: newOrderUuid,
        deliveryMethod: deliveryMethod,
        dropUuid: dropUuid,
        stripeToken: 'NOT_IMPLEMENTED',
        deliveryAddressLine1: this.contactDetails.street || '',
        deliveryAddressLine2: '',
        deliveryAddressCity: this.contactDetails.city || '',
        deliveryAddressPostcode: this.contactDetails.postalCode || '',
        deliveryAddressCountry: this.contactDetails.country || '',
      };

      console.log(`FINAL ORDER DETAILS`);
      console.log(createOrderObj);

      return this.createOrder(
        creatingOrder,
        createOrderObj,
        orderTotal,
        deliveryMethod,
        sellerUuid
      ).then((ok) => {
        this.clearModalsAndNavigate(newOrderUuid);
        this.fireConfetti1();
      });
    });

    console.log(`Getting paymentIntent`);
    // Connect to your backend endpoint, and get paymentIntent.
    const paymentIntent = await this.getPaymentIntent(
      orderTotal,
      dropUuid,
      deliveryMethod
    );

    console.log(`Presenting Apple Pay to user`);
    await this.createApplePay(paymentIntent, dropUuid, orderTotal);

    await Stripe.presentApplePay();
  }

  public isApplePayAvailable(): Promise<void> {
    return Stripe.isApplePayAvailable().catch(() => undefined);
  }

  private async getPaymentIntent(
    orderTotal: number,
    dropUuid: string,
    deliveryMethod: DeliveryMethod
  ): Promise<{ client_secret: string }> {
    return this.ordersService
      .getPaymentIntent(orderTotal, dropUuid, deliveryMethod)
      .pipe(first())
      .toPromise(Promise) as Promise<{ client_secret: string }>;
  }

  private async createApplePay(
    paymentIntent: { client_secret: string },
    dropUuid: string,
    orderTotal: number
  ): Promise<void> {
    return Stripe.createApplePay({
      paymentIntentClientSecret: paymentIntent?.client_secret || '',
      paymentSummaryItems: [
        {
          label: `LocalShelf Drop ${dropUuid}`,
          amount: orderTotal,
        },
      ],
      merchantIdentifier: 'merchant.localshelf.market',
      countryCode: 'GB',
      currency: 'GBP',
      requiredShippingContactFields: [
        'postalAddress',
        'phoneNumber',
        'emailAddress',
        'name',
      ],
    });
  }

  private getDemoCreateOrderObj(
    newOrderUuid: string,
    deliveryMethod: DeliveryMethod,
    dropUuid: string
  ) {
    const createOrderObj: ICreateOrder = {
      uuid: newOrderUuid,
      deliveryMethod: deliveryMethod,
      dropUuid: dropUuid,
      stripeToken: 'NOT_IMPLEMENTED',
      deliveryAddressLine1: 'Demo address Line 1',
      deliveryAddressLine2: '',
      deliveryAddressCity: 'Demo City' || '',
      deliveryAddressPostcode: 'this.contactDetails.postalCode' || '',
      deliveryAddressCountry: 'this.contactDetails.country' || '',
    };
    return createOrderObj;
  }

  private createOrder(
    creatingOrder: HTMLIonLoadingElement,
    createOrderObj: ICreateOrder,
    orderTotal: number,
    deliveryMethod: DeliveryMethod,
    sellerUuid: string
  ) {
    return this.ordersService
      .createOrder(createOrderObj, orderTotal, deliveryMethod, sellerUuid)
      .toPromise(Promise)
      .then((ok) => {
        return creatingOrder.dismiss().then((ok) => {
          return Promise.resolve();
        });
      })
      .catch((err) => {
        creatingOrder.dismiss();
        return Promise.reject(err);
      });
  }

  private fireConfetti1() {
    try {
      confetti.create()({
        shapes: ['square'],
        particleCount: 100,
        spread: 90,
        origin: {
          y: 1,
          x: 0.5,
        },
      });
    } catch (e) {
      console.log(e);
    }
  }

  clearModalsAndNavigate(uuid: string) {
    this.close();
    this.navController.navigateRoot('/tabs/tab1');
    this.navController.navigateForward('/view-order/' + uuid);
  }

  close() {
    this.modalCtrl.dismiss(null, 'cancel', 'checkout');
  }
}
