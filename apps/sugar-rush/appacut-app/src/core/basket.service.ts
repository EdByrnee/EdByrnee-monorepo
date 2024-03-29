import { Injectable } from '@angular/core';
import { IDrop } from '@shoppr-monorepo/api-interfaces';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BasketService {
  _basket$ = new BehaviorSubject<IBasketItem[]>([]);

  _discounts$ = new BehaviorSubject<IDiscount[]>([]);

  _basketTotal$ = new BehaviorSubject<number>(0);

  constructor() {}

  get basket$() {
    return this._basket$.asObservable();
  }

  get basketTotal$() {
    return this._basketTotal$.asObservable();
  }

  addToBasket(item: IDrop) {
    // Add or increment qty
    const currentValue = this._basket$.value;
    const existingItem = currentValue.find((i) => i.drop.uuid === item.uuid);
    if (existingItem) {
      existingItem.qty++;
    } else {
      currentValue.push({ drop: item, qty: 1 });
    }
    const updatedValue = currentValue;
    this._basket$.next(updatedValue);
    this.updateBasketTotal();
  }

  removeFromBasket(item: IDrop) {
    const currentValue = this._basket$.value;
    const existingItem = currentValue.find((i) => i.drop.uuid === item.uuid);
    if (existingItem) {
      existingItem.qty--;
      if (existingItem.qty === 0) {
        const index = currentValue.indexOf(existingItem);
        currentValue.splice(index, 1);
      }
    }
    const updatedValue = currentValue;
    this._basket$.next(updatedValue);
    this.updateBasketTotal();
  }

  updateBasketTotal() {
    const currentValue = this._basket$.value;
    const total = currentValue.reduce((acc, item) => {
      return acc + item.drop.price * item.qty;
    }, 0);
    this._basketTotal$.next(total);
  }

  getDropUuids() {
    const currentValue = this._basket$.value;
    const dropUuids = currentValue.map((item) => item.drop.uuid);
    return dropUuids;
  }

  getOrderTotal() {
    const currentValue = this._basket$.value;
    const total = currentValue.reduce((acc, item) => {
      return acc + item.drop.price * item.qty;
    }, 0);
    return total;
  }

  public setDiscounts(discounts: any) {
    this._discounts$.next(discounts);
  }

  public getDiscounts() {
    return this._discounts$.value;
  }
}

export interface IBasketItem {
  drop: IDrop;
  qty: number;
}

export interface IDiscount {
  discount_display_name: 'Promo Code';
  total_discount: number;
}
