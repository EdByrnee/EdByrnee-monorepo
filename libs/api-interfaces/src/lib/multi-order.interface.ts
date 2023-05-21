import { DeliveryMethod } from './interface/delivery-method.interface';
import { OrderStatus } from './interface/order-status.interface';
import { IMultiOrderLine } from './multi-order-line';

export interface IMultiOrder {
  uuid: string;
  deliveryMethod: DeliveryMethod;
  order_total: number;
  order_status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
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
  multiOrderLines?: IMultiOrderLine[];
  distance?: number;
  driverUuid?: string;
  assignedToDriverAt?: string;
  deliveredAt?: string;
  deliveryLat?: number;
  deliveryLng?: number;
}
