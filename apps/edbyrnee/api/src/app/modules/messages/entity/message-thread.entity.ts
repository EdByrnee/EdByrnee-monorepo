import { Table, Model, Column, DataType, HasMany } from 'sequelize-typescript';
import { Message } from './message.entity';

@Table({ tableName: 'MessageThreads', timestamps: true })
export class MessageThread extends Model {
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
    unique: 'oneDiscussionPerUserPair',
    allowNull: false,
  })
  participant1UserUuid: string;

  @Column({
    type: DataType.STRING,
    unique: 'oneDiscussionPerUserPair',
    allowNull: false,
  })
  participant2UserUuid: string;

  @Column({
    type: DataType.BOOLEAN,
    unique: 'oneDiscussionPerUserPair',
    allowNull: false,
  })
  threadLatestRead: boolean;

  @Column({
    type: DataType.DATE,
    unique: 'oneDiscussionPerUserPair',
    allowNull: false,
  })
  threadLatestMessageAt: string;

  @HasMany(() => Message, 'messageThreadId')
  messages: Message[];
}
