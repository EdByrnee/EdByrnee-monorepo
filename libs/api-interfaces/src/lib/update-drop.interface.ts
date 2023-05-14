import { DropStatus } from "./interface/drop-status.interface";

export interface IUpdateDrop {
  imageUuidsToRemove: string[];
  name: string;
  description: string;
  price: number;
  status: DropStatus;
  qty_available: number;
  size?: string;
  ingredients: string;
  age_restricted: boolean;
  photoBlobs?: Blob[];
  localDeliveryEnabled: boolean;
  nationalDeliveryEnabled: boolean;
  collectionEnabled: boolean;
  localDeliveryCost?: number;
  localDeliveryGuidelines?: string;
  nationalDeliveryCost?: number;
  nationalDeliveryGuidelines?: string;
  collectionCost?: number;
  collectionGuidelines?: string;
  collectionAddressLine1?: string;
  collectionAddressLine2?: string;
  collectionAddressCity?: string;
  collectionAddressPostcode?: string;
}
