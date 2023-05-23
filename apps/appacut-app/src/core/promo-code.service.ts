import { Injectable } from '@angular/core';
import { BasketService } from './basket.service';

/* Validates promo codes and returns discounts */

@Injectable({
  providedIn: 'root',
})
export class PromoCodeService {
  constructor(private basketService: BasketService) {}

  // apply(code: string): IPromoCode | null {
  //   if (this.isPromoCodeAlreadyApplied(code)) {
  //     return null;
  //   }

  //   const discount = this.validateOnBackend(code);

  //   this.basketService.setDiscounts(discount);

  //   this.basketService._basket$.subscribe((basket) => {
  //     /* Any time the basket changes, we need to re-calculate the discounts and total */
  //   });

  //   return null;
  // }

  validateOnBackend(code: string) {
    return {
      code: '50OFF',
      discountType: 'percent',
      discountAmount: 0,
      discountPercent: 0.5,
    };
  }

  // private isPromoCodeAlreadyApplied(code: string) {
  //   const currentDiscounts = this._discounts$.value;
  //   const existingDiscount = currentDiscounts.find(
  //     (discount) => discount.code === code
  //   );
  //   return existingDiscount;
  // }
}

export interface IPromoCode {
  code: string;
  discountType: 'percent' | 'amount';
  discountAmount: number;
  discountPercent: number;
}
