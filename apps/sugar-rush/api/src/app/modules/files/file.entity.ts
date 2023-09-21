import { Table, Model, Column, DataType } from 'sequelize-typescript';

@Table({ tableName: 'Files', timestamps: true })
export class FileEntity extends Model {
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
    unique: 'onKeyInBucket',
    allowNull: false,
  })
  bucketName: string;

  @Column({
    type: DataType.STRING,
    unique: 'onKeyInBucket',
    allowNull: false,
  })
  fileKey: string;

  @Column({
    type: DataType.STRING,
    unique: 'onKeyInBucket',
    allowNull: true,
  })
  publicUrl: string;
}
