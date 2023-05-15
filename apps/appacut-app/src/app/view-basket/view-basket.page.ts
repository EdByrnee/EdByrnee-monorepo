import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  AlertController,
  LoadingController,
  ModalController,
  NavController,
} from '@ionic/angular';
import { ICreateOrder, IDrop } from '@shoppr-monorepo/api-interfaces';
import { OrdersService } from '../../core/orders';
import * as uuid from 'uuid';
import { CheckoutPage } from '../checkout/checkout.page';
import { BasketService, IBasketItem } from '../../core/basket.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'shoppr-monorepo-view-basket',
  templateUrl: './view-basket.page.html',
  styleUrls: ['./view-basket.page.scss'],
})
export class ViewBasketPage {
  checkoutForm: FormGroup = new FormGroup({
    // qty: new FormControl(1, []),
    // deliveryMethod: new FormControl(null, [Validators.required]),
    deliveryAddress: new FormControl(null, []),
  });

  dropUuid: string;
  makerUuid: string;
  drop: IDrop;

  name = 'name';

  constructor(
    private modalCtrl: ModalController,
    private loadingController: LoadingController,
    private navController: NavController,
    private orderService: OrdersService,
    private alertController: AlertController,
    private basketService: BasketService
  ) {}

  basket$: Observable<IBasketItem[]> = this.basketService.basket$;

  getOrderTotal(): number {
    return this.drop.price + Number(this.delieveryPrice);
  }

  get delieveryPrice(): number | null {
    const deliveryMethod = this.checkoutForm.get('deliveryMethod')?.value;
    if (deliveryMethod === 'NATIONAL_DELIVERY')
      return Number(this.drop.nationalDeliveryCost);
    if (deliveryMethod === 'LOCATION_DELIVERY')
      return Number(this.drop.localDeliveryCost);
    return 0;
  }

  addToBasket(drop: IDrop) {
    this.basketService.addToBasket(drop);
  }

  removeFromBasket(drop: IDrop) {
    this.basketService.removeFromBasket(drop);
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm() {
    return this.modalCtrl.dismiss(this.name, 'confirm');
  }

  decreaseQty() {
    this.checkoutForm.controls['qty'].setValue(
      this.checkoutForm.controls['qty'].value - 1
    );
  }

  incrementQty() {
    this.checkoutForm.controls['qty'].setValue(
      this.checkoutForm.controls['qty'].value + 1
    );
  }

  buildNewOrder(): ICreateOrder {
    const order = this.checkoutForm.value;
    order.uuid = uuid.v4();
    order.dropUuid = this.dropUuid;
    order.stripeToken = 'demo_tok';
    return order;
  }

  async goToCheckout() {
    await this.modalCtrl.dismiss(null, 'cancel');
    const modal = await this.modalCtrl.create({
      id : 'checkout',
      component: CheckoutPage,
      componentProps: {
        order: this.buildNewOrder(),
        drop: this.drop,
        delieveryPrice: this.delieveryPrice,
        orderTotal: this.getOrderTotal(),
        deliveryMethod: this.checkoutForm.get('deliveryMethod')?.value,
      },
    });

    modal.onWillDismiss().then((data) => {
      modal.dismiss(null, 'confirm');
    });

    modal.present();
  }
}
