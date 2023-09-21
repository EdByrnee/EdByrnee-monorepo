import { Table, Model, Column, DataType, BelongsTo, ForeignKey } from 'sequelize-typescript';
import { UserProfile } from './user-profile.entity';

@Table({ tableName: 'UserRoles' })
export class UserRole extends Model<UserRole> {
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
  role_name: string;

  @ForeignKey(() => UserProfile)
  @Column({
    type: DataType.INTEGER,
    unique: true,
    allowNull: false,
  })
  userId: number;

  @BelongsTo(() => UserProfile)
  userProfile: UserProfile;
  
}
