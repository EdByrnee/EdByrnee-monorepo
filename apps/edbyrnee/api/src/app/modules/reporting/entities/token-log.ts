import { Table, Model, Column, DataType } from 'sequelize-typescript';

@Table({ tableName: 'TokenLogs', timestamps: true })
export class TokenLog extends Model<TokenLog> {
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
  token_value: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  token_name: string;
}
