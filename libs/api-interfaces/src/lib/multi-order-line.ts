import { IDrop } from './drop.interface';
import { IMultiOrder } from './multi-order.interface';

export interface IMultiOrderLine {
  uuid: string;
  unit_price: number;
  quantity: number;
  line_total: number;
  multiOrder: IMultiOrder | null;
  line_title: string;
  dropUuid: string;
  drop?: IDrop;
}
