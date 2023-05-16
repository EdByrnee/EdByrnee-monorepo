import { DeliveryMethod } from "./interface/delivery-method.interface";

export interface ICreateMultiOrder {
  uuid: string;
  deliveryMethod: DeliveryMethod;
  dropUuids: string[];
  qty?: number;
  stripeToken: string;
  deliveryAddressLine1: string;
  deliveryAddressLine2: string;
  deliveryAddressCity: string;
  deliveryAddressPostcode: string;
  deliveryAddressCountry: string;
}
