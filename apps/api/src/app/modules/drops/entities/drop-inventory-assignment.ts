import {
  Table,
  Model,
  Column,
  DataType,
  BelongsTo,
} from 'sequelize-typescript';
import { Drop } from './drop.entity';

@Table({ tableName: 'DropInventoryAssignments', timestamps: true })
export class DropInventoryAssignment extends Model<DropInventoryAssignment> {
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
    type: DataType.INTEGER,
    allowNull: false,
  })
  qty: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  dropId: string;

  @BelongsTo(() => Drop, 'dropId')
  drop: Drop;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  driverUuid: string;
}
