import { Controller, Inject, Logger } from '@nestjs/common';
import { IRepositoryPort } from '../../core/database/ports/repository-port';
import { MessageThread } from './entity/message-thread.entity';
import { Message } from './entity/message.entity';
import { MESSAGES_THREAD_REPOSITORY } from './messages.providers';
import { Op } from 'sequelize';
import { NotificationService } from './notification.service';
import { IMessage, INewMessage } from '@shoppr-monorepo/api-interfaces';

@Controller('messages')
export class MessagesService {
  constructor(
    @Inject(MESSAGES_THREAD_REPOSITORY)
    private readonly messageThreadRepository: IRepositoryPort<MessageThread>,
    @Inject(MESSAGES_THREAD_REPOSITORY)
    private readonly messageRepository: IRepositoryPort<Message>,
    private notificationService: NotificationService
  ) {}

  async loadMessageThreads(currentUserUuid: string): Promise<MessageThread[]> {
    // load all message threads for the current user
    const messageThreads: MessageThread[] =
      await this.messageThreadRepository.findAll({
        where: {
          [Op.or]: {
            participant1UserUuid: currentUserUuid,
            participant2UserUuid: currentUserUuid,
          },
        },
      });

    return messageThreads;
  }

  async handleIncomingMessage(
    uuid: string,
    messageBody: string,
    senderUuid: string,
    recepientUuid: string
  ) {
    Logger.log(`handling message between ${senderUuid} and ${recepientUuid}`);
    // find the message thread for the sender and recipient
    Logger.log(
      `Searching for message thread between ${senderUuid} and ${recepientUuid}...`
    );
    let messageThread: MessageThread =
      await this.messageThreadRepository.findOne({
        [Op.and]: {
          participant1UserUuid: {
            [Op.or]: [senderUuid, recepientUuid],
          },
          participant2UserUuid: {
            [Op.or]: [senderUuid, recepientUuid],
          },
        },
      });

    // create a new message thread if it doesn't exist
    if (!messageThread) {
      Logger.log(
        `Message thead between ${senderUuid} and ${recepientUuid} does not exist, creating new one`
      );
      messageThread = new MessageThread({
        uuid: uuid,
        participant1UserUuid: senderUuid,
        participant2UserUuid: recepientUuid,
        threadLatestRead: false,
        threadLatestMessageAt: new Date(),
      });
      await messageThread.save();
    } else {
      Logger.log(
        `Found message thread between ${senderUuid} and ${recepientUuid} with uuid ${messageThread.uuid}`
      );
    }

    // create a new message
    const newMessage: Message = new Message({
      uuid: uuid,
      message: messageBody,
      senderUuid: senderUuid,
      recipientUuid: recepientUuid,
      messageThreadId: messageThread.id,
    });
    newMessage.save();

    const messageData: INewMessage = {
      uuid: newMessage.uuid,
      messageBody: newMessage.message,
      recepientUuid: newMessage.recipientUuid,
    };

    const notificationData: { message: INewMessage } = {
      message: messageData,
    };  

    this.notificationService.sendNotificationToUser(
      recepientUuid,
      {
        title: 'New Message',
        body: messageBody,
      },
      notificationData
    );
  }
}
