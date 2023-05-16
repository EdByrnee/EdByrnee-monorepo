import { DropStatus } from "./interface/drop-status.interface";

export interface IDrop {
  uuid: string;
  name: string;
  description: string;
  price: number;
  qty_available: number;
  size: string;
  status: DropStatus;
  ingredients: string;
  age_restricted: boolean;
  shipping: string;
  collection: string;
  makerUuid: string;
  photos?: any[];
  allergens: string;
  localDeliveryEnabled: boolean;
  nationalDeliveryEnabled: boolean;
  collectionEnabled: boolean;
  localDeliveryCost?: string;
  localDeliveryGuidelines?: string;
  nationalDeliveryCost?: string;
  nationalDeliveryGuidelines?: string;
  collectionCost?: string;
  collectionGuidelines?: string;
  collectionAddressLine1?: string;
  collectionAddressLine2?: string;
  collectionAddressCity?: string;
  collectionAddressPostcode?: string;
  localDeliveryLat?: number;
  localDeliveryLng?: number;
  localDeliveryRadius?: number;
  itemCode: string;
}
