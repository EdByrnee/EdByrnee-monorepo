import { DropStatus } from '@shoppr-monorepo/api-interfaces';
import {
  Table,
  Model,
  Column,
  DataType,
  HasOne,
  HasMany,
} from 'sequelize-typescript';
import { PasswordResetToken } from './user-password-reset-token';
import { Exclude } from 'class-transformer';
import { UserPhoto } from './user-photos.entity';
import { UserRole } from './user-role.entity';

@Table({ tableName: 'UserProfiles', paranoid: true })
export class UserProfile extends Model<UserProfile> {
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
    allowNull: true,
  })
  name: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  username: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  website: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  bio: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  story: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  maker: boolean;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  photoUrl: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  email: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  lastSetPostcode: string;

  @Exclude()
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  password: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  mobile_number: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  createdAt: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  updatedAt: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  deletedAt: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  lastSignIn: Date;

  @Column({
    type: DataType.BOOLEAN,
  })
  emailVerified: boolean;

  @HasOne(() => PasswordResetToken)
  passwordResetToken: PasswordResetToken;

  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
  })
  activeDropCount: number;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  location: string;

  @HasMany(() => UserPhoto)
  userPhotos: UserPhoto[];

  // @HasOne(() => EmailValidationToken)
  // emailValidationToken: EmailValidationToken;

  @HasMany(() => UserRole)
  userRoles: UserRole;
}
