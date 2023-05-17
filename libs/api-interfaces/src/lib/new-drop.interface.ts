export interface INewDrop {
  uuid: string;
  name: string;
  description: string;
  price: string;
  qty_available: string;
  itemCode: string;
  size?: string;
  ingredients: string;
  age_restricted: boolean;
  photoBlobs?: Blob[];
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
}
