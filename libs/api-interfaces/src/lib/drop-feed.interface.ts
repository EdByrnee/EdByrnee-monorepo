import { IDrop } from './drop.interface';
import { IUserProfile } from './user-profile.interface';

export interface IDropFeed {
  title: string;
  listingType: string;
  // listingType: 'Drop_Vertical' | 'Drop_Horizontal' | 'Maker';
  // data: IDrop[] | IUserProfile[];
  data: any[];
  appendWithPostcode: boolean;
}
