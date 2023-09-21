import {
  Table,
  Model,
  Column,
  DataType,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';
import { UserProfile } from './user-profile.entity';
@Table({ tableName: 'UserPhotos' })
export class UserPhoto extends Model<UserPhoto> {
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

  @BelongsTo(() => UserProfile, 'userProfileId')
  userProfile: UserProfile;

  @ForeignKey(() => UserProfile)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  userProfileId: number;
}
