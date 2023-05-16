import { DropStatus } from '@shoppr-monorepo/api-interfaces';
import { Table, Model, Column, DataType, HasMany } from 'sequelize-typescript';
import { DropPhoto } from './drop-photo.entity';
import { DropInventoryAssignment } from './drop-inventory-assignment';

@Table({ tableName: 'Drops', timestamps: true })
export class Drop extends Model<Drop> {
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
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  description: string;

  @Column({
    type: DataType.ENUM(
      'AWAITING_APPROVAL',
      'ACTIVE_LISTING',
      'DELISTED_FOR_HOLIDAY'
    ),
    allowNull: false,
    defaultValue: 'AWAITING_APPROVAL',
  })
  status: DropStatus;

  @Column({
    type: DataType.DOUBLE(15, 2),
    allowNull: true,
  })
  price: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  qty_available: number;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  size: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  ingredients: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  allergens: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  age_restricted: boolean;

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  makerUuid: string;

  @HasMany(() => DropPhoto, 'dropId')
  photos: DropPhoto[];

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  localDeliveryCost: number;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  localDeliveryGuidelines: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  nationalDeliveryCost: number;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  nationalDeliveryGuidelines: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  collectionGuidelines: string;

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
  itemCode: string;

  @Column({
    type: DataType.BOOLEAN,
  })
  localDeliveryEnabled: boolean;

  @Column({
    type: DataType.BOOLEAN,
  })
  nationalDeliveryEnabled: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  collectionEnabled: boolean;

  @Column({
    type: DataType.FLOAT,
    allowNull: true,
  })
  localDeliveryLat: number;

  @Column({
    type: DataType.FLOAT,
    allowNull: true,
  })
  localDeliveryLng: number;

  @Column({
    type: DataType.FLOAT,
    allowNull: true,
  })
  localDeliveryRadius: number;

  @HasMany(() => DropInventoryAssignment, 'dropId')
  dropInventoryAssignments: DropInventoryAssignment[];
}
