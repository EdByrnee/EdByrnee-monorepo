import { IDrop } from "./drop.interface";

export interface IDropItem {
  uuid: string;
  drop: IDrop;
  expiration_date: string;
  withDriver: boolean;
  driverUuid: string;
  location: any;
  createdAt: string;
  updatedAt: string;
}
