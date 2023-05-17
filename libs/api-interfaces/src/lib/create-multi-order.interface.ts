import { DeliveryMethod } from "./interface/delivery-method.interface";

export interface ICreateMultiOrder {
  uuid: string;
  dropUuids: string[];
  qty?: number;
  stripeToken: string;
  deliveryAddressLine1: string;
  deliveryAddressLine2: string;
  deliveryAddressCity: string;
  deliveryAddressPostcode: string;
  deliveryAddressCountry: string;
}
