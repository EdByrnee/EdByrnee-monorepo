import { FirebaseMessagingService } from '@aginix/nestjs-firebase-admin';
import { Controller, Inject, Logger } from '@nestjs/common';
import { messaging } from 'firebase-admin';
import { UserFCMToken } from './entity/user-fcm-token';
import * as uuid from 'uuid';
import { IRepositoryPort } from '../../core/database/ports/repository-port';
import { USER_FCM_TOKEN_REPOSITORY } from './messages.providers';

@Controller('messages')
export class NotificationService {
  Logger = new Logger(NotificationService.name);

  constructor(
    private firebaseMessaging: FirebaseMessagingService,
    @Inject(USER_FCM_TOKEN_REPOSITORY)
    private userFCMTokenRepository: IRepositoryPort<UserFCMToken>
  ) {}

  async sendNotificationToUser(
    userUuid: string,
    notification: { title: string; body: string },
    data: any
  ) {
    Logger.log(
      `Sending notification to all devices registered to user ${userUuid}...`
    );

    const tokenEntities: UserFCMToken[] =
      await this.userFCMTokenRepository.findAll({
        where: {
          userUuid: userUuid,
        },
      });

    Logger.log(`Found ${tokenEntities.length} tokens for user ${userUuid}`);

    const tokens: string[] = tokenEntities.map((t) => {
      return t.fcmToken;
    });

    Logger.log(`Sending notification to ${tokens.length} devices...`);
    Logger.log(`Sending to tokens: ${tokens.join(', ')}`);

    const result = await this.firebaseMessaging
      .sendMulticast({
        notification,
        data: data,
        tokens,
      })
      .then((response) => {
        Logger.log(response.successCount + ' messages were sent successfully');
      });

    return result;
  }

  async registerFcmToken(userUuid: string, token: string, deviceUuid: string) {
    Logger.log(
      `Registering fcm token for user ${userUuid} with token ${token}`
    );

    const existingUserToken: UserFCMToken =
      await this.userFCMTokenRepository.findOne({
        userUuid,
        deviceUuid,
      });

    if (existingUserToken) {
      Logger.log(`User already has a token, updating it`);
      existingUserToken.fcmToken = token;
      await existingUserToken.save();
      return;
    } else {
      Logger.log(`Registering client token for user`);

      const userFCMToken = new UserFCMToken({
        uuid: uuid.v4(),
        userUuid,
        fcmToken: token,
        deviceUuid,
      });

      await userFCMToken.save();
    }
  }
}
