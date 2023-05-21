import { DeliveryMethod } from './interface/delivery-method.interface';
import { OrderStatus } from './interface/order-status.interface';

export interface IOrder {
  id: number;
  uuid: string;
  deliveryMethod: DeliveryMethod;
  dropUuid: string;
  order_total: number;
  order_status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
  buyerUuid: string;
  sellerUuid: string;
  deliveryAddressLine1?: string;
  deliveryAddressLine2?: string;
  deliveryAddressCity?: string;
  deliveryAddressPostcode?: string;
  deliveryAddressCountry?: string;
  collectionAddressLine1?: string;
  collectionAddressLine2?: string;
  collectionAddressCity?: string;
  collectionAddressPostcode?: string;
  collectionAddressCountry?: string;
  dropName?: string;
  makerName?: string;
}
