import {
  Column,
  DataType,
  Model,
  Table,
} from 'sequelize-typescript';

@Table({ tableName: 'ConfigKeyValuePairs' })

export class ConfigKeyValuePair extends Model<ConfigKeyValuePair> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  })
  id: number;

  @Column({
    type: DataType.UUIDV4,
    allowNull: false,
  })
  uuid: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  key: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  value: string;
}
