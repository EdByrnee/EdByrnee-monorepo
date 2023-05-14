import { SequelizeRepo } from '../../core/database/infra/sequelize-repo';
import { Order } from './order.entity';

export const ORDERS_REPOSITORY = 'ORDERS_REPOSITORY';

export const ordersProviders = [
  {
    provide: ORDERS_REPOSITORY,
    useFactory: () => new SequelizeRepo<Order>(Order),
  },
];

export const ORDER_ENTITIES = [Order];