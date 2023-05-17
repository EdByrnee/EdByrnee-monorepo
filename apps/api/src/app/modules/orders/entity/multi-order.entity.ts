import { OrderStatus, DeliveryMethod } from '@shoppr-monorepo/api-interfaces';
import { Table, Model, Column, DataType, HasMany } from 'sequelize-typescript';
import { MultiOrderLine } from './multi-order-line';

@Table({ tableName: 'MultiOrders', timestamps: true })
export class MultiOrder extends Model<MultiOrder> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  })
  id: number;

  @Column({
    type: DataType.UUID,
    unique: true,
    allowNull: false,
  })
  uuid: string;

  @Column({
    type: DataType.DOUBLE(15, 2),
    allowNull: false,
  })
  order_total: number;

  @Column({
    type: DataType.ENUM('OPEN','ASSIGNED_TO_DRIVER', 'CLOSED'),
    allowNull: false,
  })
  order_status: OrderStatus;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  deliveryAddressLine1: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  deliveryAddressLine2: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  deliveryAddressCity: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  deliveryAddressPostcode: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  deliveryAddressCountry: string;

  @Column({
    type: DataType.ENUM('COLLECTION', 'NATIONAL_DELIVERY', 'LOCAL_DELIVERY'),
    allowNull: false,
  })
  deliveryMethod: DeliveryMethod;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  collectionAddressLine1: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  collectionAddressLine2: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  collectionAddressCity: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  collectionAddressPostcode: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  collectionAddressCountry: string;

  // Buyeruuid
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  buyerUuid: string;

  // Has Many order lines
  @HasMany(() => MultiOrderLine, 'multiOrderId')
  order_lines: MultiOrderLine[];
}
