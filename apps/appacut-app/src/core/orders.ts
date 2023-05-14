import { Injectable } from '@angular/core';
import {
  DeliveryMethod as DeliveryMethod,
  ICreateOrder,
  IOrder,
  OrderStatus,
} from '@shoppr-monorepo/api-interfaces';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { AuthService } from './auth';
import * as uuid from 'uuid';
import Stripe from 'stripe';
import { AnalyticsService } from './analytics';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  public api = environment.api;

  orders: BehaviorSubject<IOrder[]> = new BehaviorSubject<any[]>([]);

  sales: BehaviorSubject<IOrder[]> = new BehaviorSubject<any[]>([]);

  purchases: BehaviorSubject<IOrder[]> = new BehaviorSubject<any[]>([]);

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private analyticsService: AnalyticsService
    ) {}

  getOrders() {
    return this.http.get<any>(this.api + '/api/orders').pipe(
      tap((res) => {
        this.sales.next(res.sales);
        this.purchases.next(res.purchases);
      })
    );
  }

  getOrder(id: string) {
    return this.http.get<IOrder>(this.api + '/api/orders/' + id);
  }

  updateOrderStatus(id: string, status: OrderStatus) {
    return this.http.patch<IOrder>(this.api + '/api/orders/' + id + '/status', {
      order_status: status,
    });
  }

  getPaymentIntent(
    orderTotal: number,
    dropUuid: string,
    deliveryMethod: DeliveryMethod
  ): Observable<Stripe.Response<Stripe.PaymentIntent>> {
    return this.http.post<Stripe.Response<Stripe.PaymentIntent>>(environment.api + '/api/orders/payment-intent', {
      dropUuid: dropUuid,
      orderTotal: orderTotal,
      deliveryMethod: deliveryMethod,
    });
  }

  createOrder(
    createOrderObj: ICreateOrder,
    orderTotal: number,
    deliveryMethod: DeliveryMethod,
    sellerUuid: string
  ): Observable<IOrder[]> {
    return this.http
      .post<IOrder[]>(this.api + '/api/orders', createOrderObj)
      .pipe(
        tap((res: any) => {
          const newOrder: IOrder = {
            uuid: createOrderObj.uuid,
            deliveryMethod: createOrderObj.deliveryMethod,
            dropUuid: createOrderObj.dropUuid,
            order_total: orderTotal,
            order_status: 'OPEN',
            createdAt: new Date(),
            updatedAt: new Date(),
            buyerUuid: this.authService.currentUser$.getValue()?.uuid || '',
            sellerUuid: sellerUuid,
          };

          this.analyticsService.logEvent({
            name: 'purchase',
            params: {
              order_uuid: newOrder.uuid,
              order_total: newOrder.order_total,
              delivery_method: newOrder.deliveryMethod,
              drop_uuid: newOrder.dropUuid,
              buyer_uuid: newOrder.buyerUuid,
              seller_uuid: newOrder.sellerUuid,
            },
          })

          const currentOrders = this.purchases.getValue();

          this.purchases.next([...currentOrders, newOrder]);
        })
      );
  }
}
