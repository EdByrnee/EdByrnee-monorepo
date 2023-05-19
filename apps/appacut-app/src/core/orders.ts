import { Injectable } from '@angular/core';
import {
  DeliveryMethod as DeliveryMethod,
  ICreateMultiOrder,
  ICreateOrder,
  IMultiOrder,
  IMultiOrderLine,
  IOrder,
  OrderStatus,
} from '@shoppr-monorepo/api-interfaces';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { AuthService } from './auth';
import Stripe from 'stripe';
import { AnalyticsService } from './analytics';
import { MapsService } from './maps.service';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  public api = environment.api;

  orders: BehaviorSubject<IMultiOrder[]> = new BehaviorSubject<any[]>([]);

  deliveries: BehaviorSubject<IMultiOrder[]> = new BehaviorSubject<any[]>([]);

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private analyticsService: AnalyticsService,
    private mapsService: MapsService
  ) {}

  getOrdersForUser() {
    return this.http.get<any>(this.api + '/api/orders').pipe(
      tap((res) => {
        this.orders.next(res);
      })
    );
  }

  getDeliveries() {
    return this.http.get<any>(this.api + '/api/orders/deliveries').pipe(
      tap((res) => {
        this.deliveries.next(res);
      })
    );
  }

  async updateDeliveriesWithDistance() {
    const currentDeliveries = this.deliveries.getValue();

    for (const delivery of currentDeliveries) {
      const distance =
        await this.mapsService.getDistanceBetweenCurrentLocationAndPostcode(
          delivery.deliveryAddressPostcode as string
        );

      delivery.distance = distance / 1000;
      // Round to 1 dp 
      delivery.distance = Math.round(delivery.distance * 10) / 10;
    }

    this.deliveries.next(currentDeliveries);
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
    dropUuids: string[]
  ): Observable<Stripe.Response<Stripe.PaymentIntent>> {
    return this.http.post<Stripe.Response<Stripe.PaymentIntent>>(
      environment.api + '/api/orders/payment-intent',
      {
        dropUuids: dropUuids,
        orderTotal: orderTotal,
      }
    );
  }

  createOrder(
    createMultiOrderObj: ICreateMultiOrder,
    orderTotal: number
  ): Observable<IOrder[]> {
    return this.http
      .post<IOrder[]>(this.api + '/api/orders', createMultiOrderObj)
      .pipe(
        tap((res: any) => {
          const newMultiOrder: IMultiOrder = {
            uuid: createMultiOrderObj.uuid,
            deliveryMethod: 'LOCAL_DELIVERY',
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
