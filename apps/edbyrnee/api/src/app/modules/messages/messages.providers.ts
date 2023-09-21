import { SequelizeRepo } from '../../core/database/infra/sequelize-repo';
import { MessageThread } from './entity/message-thread.entity';
import { Message } from './entity/message.entity';
import { UserFCMToken } from './entity/user-fcm-token';

export const MESSAGES_THREAD_REPOSITORY = 'MESSAGES_THREAD_REPOSITORY';
export const MESSAGE_REPOSITORY = 'MESSAGE_REPOSITORY';
export const USER_FCM_TOKEN_REPOSITORY = 'USER_FCM_TOKEN_REPOSITORY';

export const messageModuleRepositoryProviders = [
  {
    provide: MESSAGES_THREAD_REPOSITORY,
    useFactory: () =>
      new SequelizeRepo<MessageThread>(MessageThread, [Message]),
  },
  {
    provide: USER_FCM_TOKEN_REPOSITORY,
    useFactory: () => new SequelizeRepo<UserFCMToken>(UserFCMToken),
  },
];

export const MESSAGES_ENTITIES = [MessageThread, Message, UserFCMToken];
