import {
  Table,
  Model,
  Column,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { MultiOrder } from './multi-order.entity';

@Table({ tableName: 'MultiOrderLines', timestamps: true })
export class MultiOrderLine extends Model<MultiOrderLine> {
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
  unit_price: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  quantity: number;

  @Column({
    type: DataType.DOUBLE(15, 2),
    allowNull: false,
  })
  line_total: number;

  // Foreign Key Multi Order
  @ForeignKey(() => MultiOrder)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  multiOrderId: number;

  // Belongs To Multi Order
  @BelongsTo(() => MultiOrder)
  multiOrder: MultiOrder;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  line_title: string;
}
