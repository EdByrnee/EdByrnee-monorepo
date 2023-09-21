import {
  Table,
  Model,
  Column,
  DataType,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';
import { Drop } from './drop.entity';

@Table({ tableName: 'DropPhotos', timestamps: true })
export class DropPhoto extends Model<DropPhoto> {
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
  photo_url: string;

  @BelongsTo(() => Drop, 'dropId')
  drop: Drop;

  @ForeignKey(() => Drop)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  dropId: number;
}
