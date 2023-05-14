import { DeliveryType } from "./delivery-type";

export interface ICreatePaymentIntentRequestBody{
    orderTotal: number;
    dropUuid: string;
    deliveryType: DeliveryType;
}