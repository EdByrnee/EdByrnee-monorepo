import {
  Table,
  Model,
  Column,
  DataType,
  BelongsTo,
} from 'sequelize-typescript';
import { DelliDrop } from './delli-drop.entity';

@Table({ tableName: 'DelliDropQtySnapshots', timestamps: true })
export class DelliDropQtySnapshot extends Model<DelliDropQtySnapshot> {
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
    type: DataType.INTEGER,
    allowNull: true,
  })
  stock: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  delliDropId: number;

  @BelongsTo(() => DelliDrop, 'delliDropId')
  delliDrop: DelliDrop;
}
