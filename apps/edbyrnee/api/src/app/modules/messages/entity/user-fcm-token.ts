import {
  Table,
  Model,
  Column,
  DataType,
} from 'sequelize-typescript';

@Table({ tableName: 'UserFCMTokens', timestamps: true })
export class UserFCMToken extends Model {
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
  userUuid: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  fcmToken: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  deviceUuid: string;
}
