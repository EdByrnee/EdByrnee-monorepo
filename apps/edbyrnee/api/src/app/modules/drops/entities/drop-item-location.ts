import { Table, Model, Column, DataType, HasMany } from 'sequelize-typescript';
import { DropItem } from './drop-item';

@Table({ tableName: 'DropItemLocations', timestamps: true })
export class DropItemLocation extends Model<DropItemLocation> {
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
  location_name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  location_category: string;

  @HasMany(() => DropItem)
  dropItems: DropItem[];
}
