import { SequelizeRepo } from '../../core/database/infra/sequelize-repo';
import { MultiOrderLine } from './entity/multi-order-line';
import { MultiOrder } from './entity/multi-order.entity';
import { Order } from './entity/order.entity';

export const ORDERS_REPOSITORY = 'ORDERS_REPOSITORY';
export const MULTI_ORDER_REPOSITORY = 'MULTI_ORDER_REPOSITORY';
export const MULTI_ORDER_LINES = 'MULTI_ORDER_LINES';

export const ordersProviders = [
  {
    provide: ORDERS_REPOSITORY,
    useFactory: () => new SequelizeRepo<Order>(Order),
  },
  {
    provide: MULTI_ORDER_REPOSITORY,
    useFactory: () => new SequelizeRepo<MultiOrder>(MultiOrder),
  },
  {
    provide: MULTI_ORDER_LINES,
    useFactory: () => new SequelizeRepo<MultiOrderLine>(MultiOrderLine),
  }
];

export const ORDER_ENTITIES = [Order, MultiOrder, MultiOrderLine];
