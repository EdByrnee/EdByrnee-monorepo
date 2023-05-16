import { Injectable } from '@angular/core';
import {
  DeliveryMethod as DeliveryMethod,
  ICreateMultiOrder,
  ICreateOrder,
  IMultiOrder,
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

  orders: BehaviorSubject<IMultiOrder[]> = new BehaviorSubject<any[]>([]);

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private analyticsService: AnalyticsService
  ) {}

  getOrders() {
    return this.http.get<any>(this.api + '/api/orders').pipe(
      tap((res) => {
        this.orders.next(res);
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
    dropUuids: string[],
    deliveryMethod: DeliveryMethod
  ): Observable<Stripe.Response<Stripe.PaymentIntent>> {
    return this.http.post<Stripe.Response<Stripe.PaymentIntent>>(
      environment.api + '/api/orders/payment-intent',
      {
        dropUuids: dropUuids,
        orderTotal: orderTotal,
        deliveryMethod: deliveryMethod,
      }
    );
  }

  createOrder(
    createMultiOrderObj: ICreateMultiOrder,
    orderTotal: number,
    deliveryMethod: DeliveryMethod
  ): Observable<IOrder[]> {
    return this.http
      .post<IOrder[]>(this.api + '/api/orders/multi', createMultiOrderObj)
      .pipe(
        tap((res: any) => {
          const newMultiOrder: IMultiOrder = {
            uuid: createMultiOrderObj.uuid,
            deliveryMethod: createMultiOrderObj.deliveryMethod,
            order_total: orderTotal,
            order_status: 'OPEN',
            createdAt: new Date(),
            updatedAt: new Date(),
          };

          this.analyticsService.logEvent({
            name: 'purchase',
            params: {
              order_uuid: newMultiOrder.uuid,
              order_total: newMultiOrder.order_total,
              delivery_method: newMultiOrder.deliveryMethod,
              drop_uuids: createMultiOrderObj.dropUuids,
            },
          });

          const currentMultiOrders = this.orders.getValue();
          this.orders.next([...currentMultiOrders, newMultiOrder]);
        })
      );
  }
}
