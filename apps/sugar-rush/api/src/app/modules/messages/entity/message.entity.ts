import { Table, Model, Column, DataType, BelongsTo } from 'sequelize-typescript';
import { MessageThread } from './message-thread.entity';

@Table({ tableName: 'Messages', timestamps: true })
export class Message extends Model {
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
  message: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  senderUuid: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  recipientUuid: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  messageThreadId: number;

  // @BelongsTo(() => MessageThread)
  // messageThread: MessageThread;
}
