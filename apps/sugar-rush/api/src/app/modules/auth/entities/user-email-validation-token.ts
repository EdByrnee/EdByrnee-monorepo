import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { UserProfile } from './user-profile.entity';

@Table({ tableName: 'EmailValidationTokens' })
export class EmailValidationToken extends Model<EmailValidationToken> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  })
  id: number;

  @ForeignKey(() => UserProfile)
  @Column({
    type: DataType.INTEGER,
    unique: true,
    allowNull: false,
  })
  userId: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  token: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  expiresOn: Date;
}
