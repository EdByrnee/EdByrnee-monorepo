import { DeliveryMethod } from "./interface/delivery-method.interface";

export interface ICreateOrder {
  uuid: string;
  deliveryMethod: DeliveryMethod;
  dropUuid: string;
  qty?: number;
  stripeToken: string;
  deliveryAddressLine1: string;
  deliveryAddressLine2: string;
  deliveryAddressCity: string;
  deliveryAddressPostcode: string;
  deliveryAddressCountry: string;
}
