import {
  Table,
  Model,
  Column,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { DropItemLocation } from './drop-item-location';
import { Drop } from './drop.entity';

@Table({ tableName: 'DropItems', timestamps: true })
export class DropItem extends Model<DropItem> {
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
    type: DataType.DATE,
    allowNull: true,
  })
  expiration_date: string;

  /* Drop Item is either attached to a location or a driver */
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  withDriver: boolean;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  driverUuid: string;

  @ForeignKey(() => DropItemLocation)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  locationId: number;

  @BelongsTo(() => DropItemLocation, 'locationId')
  location: DropItemLocation;

  @ForeignKey(() => Drop)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  dropId: number;

  @BelongsTo(() => Drop, 'dropId')
  drop: Drop;
}
