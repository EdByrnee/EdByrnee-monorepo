import { Table, Model, Column, DataType, HasMany } from 'sequelize-typescript';
import { DelliDropQtySnapshot } from './delli-drop-qty';

@Table({ tableName: 'DelliDrops', timestamps: true })
export class DelliDrop extends Model<DelliDrop> {
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
    allowNull: true,
  })
  uuid: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  name: string;

  @Column({
    type: DataType.DOUBLE(10, 2),
    allowNull: true,
  })
  price: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  stock: number;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  description: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  likes: number;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  madeByUsername: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  sales: number;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true
  })
  collectionAvailable: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true
  })
  localDeliveryAvailable: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true
  })
  nationalDeliveryAvailable: boolean;

  // Has many qty
  @HasMany(() => DelliDropQtySnapshot, 'delliDropId')
  qtySnapshots: DelliDropQtySnapshot[];
}
