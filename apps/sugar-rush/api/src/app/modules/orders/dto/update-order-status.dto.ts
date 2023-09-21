import { OrderStatus } from '@shoppr-monorepo/api-interfaces';
import { IsNotEmpty } from 'class-validator';

export class UpdateOrderStatusDto {
  @IsNotEmpty()
  order_status: OrderStatus;
}
