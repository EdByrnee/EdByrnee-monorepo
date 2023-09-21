import { Injectable } from '@angular/core';
import { BasketService, IDiscount } from './basket.service';
import { AlertController } from '@ionic/angular';
import { IBasketItem } from './basket.service';

/* Validates promo codes and returns discounts */

@Injectable({
  providedIn: 'root',
})
export class PromoCodeService {
  _appliedPromoCodes: string[] = [];

  constructor(
    private basketService: BasketService,
    private alertController: AlertController
  ) {}

  public async apply(code: string) {
    if (this.isPromoCodeAlreadyApplied(code)) {
      const alert = await this.alertController.create({
        header: 'Promo code already applied',
        message: 'You have already applied this promo code',
        buttons: ['OK'],
      });
      await alert.present();
      return;
    }

    let discount = this.validateOnBackend(code);

    /* Calculate the final discount amoount for this code */
    discount = this.calculateDiscount(
      this.basketService._basket$.value,
      discount
    );

    /* add the discount */
    const exitstingDiscounts = this.basketService._discounts$.value;
    const newDiscount: IDiscount = {
      discount_display_name: 'Promo Code',
      total_discount: discount.calculatedDiscount as number
    }
    const newDiscountArray = [...exitstingDiscounts,newDiscount];
    this.basketService.setDiscounts(newDiscountArray);

    this.basketService._basket$.subscribe((basket) => {
      /* Any time the basket changes, we need to re-calculate the discounts and total */
      const currentTotal = this.basketService.getOrderTotal();
      const newTotal = currentTotal - (discount.calculatedDiscount as number);
      this.basketService._basketTotal$.next(newTotal);
    });

    this._appliedPromoCodes.push(code);

    return null;
  }

  private calculateDiscount(basket: IBasketItem[], discount: IPromoCode) {
    const total = basket.reduce((acc, item) => {
      return acc + item.drop.price * item.qty;
    }, 0);

    if (discount.discountType === 'percent') {
      discount.calculatedDiscount = total * discount.discountPercent;
    } else {
      discount.calculatedDiscount = discount.discountAmount;
    }
    return discount;
  }

  private validateOnBackend(code: string): IPromoCode {
    return {
      code: '50OFF',
      discountType: 'percent',
      discountAmount: 0,
      discountPercent: 0.5,
    };
  }

  private isPromoCodeAlreadyApplied(code: string) {
    return this._appliedPromoCodes.includes(code);
  }
}

export interface IPromoCode {
  code: string;
  discountType: 'percent' | 'amount';
  discountAmount: number;
  discountPercent: number;
  calculatedDiscount?: number;
}
