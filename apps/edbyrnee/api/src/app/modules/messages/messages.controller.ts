import { Body, Controller, Get, Logger, Post } from '@nestjs/common';
import { IMessageThread } from '@shoppr-monorepo/api-interfaces';
import { SequelizeUow } from '../../core/database/infra/sequelize-uow';
import { AuthService } from '../auth/auth.service';
import { UserProfile } from '../auth/entities/user-profile.entity';
import { RequestUser } from '../auth/utils/jwt.strategy';
import { User } from '../auth/utils/user.decorator';
import { NewMessageDto } from './dto/new-message.dto';
import { MessagesService } from './messages.service';
import { NotificationService } from './notification.service';

@Controller('messages')
export class MessagesController {
  Logger = new Logger('MessagesController');

  constructor(
    private messageService: MessagesService,
    private authService: AuthService,
    private uow: SequelizeUow,
    private notificationService: NotificationService
  ) {}

  @Get('/threads')
  async loadMessageThreads(
    @User() user: RequestUser
  ): Promise<IMessageThread[]> {
    return await this.uow.execute(async () => {
      const currentUserUuid = user.uuid;

      let messageThreads: IMessageThread[] =
        (await this.messageService.loadMessageThreads(user.uuid)) as any;
      messageThreads = JSON.parse(JSON.stringify(messageThreads));

      const participantProfile = await this.authService.getProfile(user.uuid);

      const participentUuids = [];

      messageThreads.forEach((thread) => {
        const participantUuid =
          thread.participant1UserUuid !== user.uuid
            ? thread.participant1UserUuid
            : thread.participant2UserUuid;
        participentUuids.push(participantUuid);
      });

      const participantProfiles: UserProfile[] =
        await this.authService.getUserProfiles(participentUuids);

      // Get the participant profile for each thread
      messageThreads.map((thread) => {
        const participantUuid =
          thread.participant1UserUuid !== user.uuid
            ? thread.participant1UserUuid
            : thread.participant2UserUuid;
        const participantProfile = participantProfiles.find(
          (profile) => profile.uuid === participantUuid
        );
        thread.participant = participantProfile;
        // end of participant profile

        thread.messages = thread.messages.map((message) => {
          message.sender = message.senderUuid === currentUserUuid;
          return message;
        });

        thread['forUser'] = currentUserUuid;

        return thread;
      });

      return messageThreads;
    });
  }

  @Post('')
  async handleIncomingMessage(
    @User() user: RequestUser,
    @Body() body: NewMessageDto
  ): Promise<any> {
    return await this.uow.execute(async () => {
      const currentUserUuid = user.uuid;
      await this.messageService.handleIncomingMessage(
        body.uuid,
        body.messageBody,
        currentUserUuid,
        body.recepientUuid
      );
    });
  }

  @Post('register-fcm-token')
  async registerFcmToken(
    @User() user: RequestUser,
    @Body() body: { token: string; deviceUuid: string }
  ): Promise<any> {
    return await this.uow.execute(async () => {
      const currentUserUuid = user.uuid;
      await this.notificationService.registerFcmToken(
        currentUserUuid,
        body.token,
        body.deviceUuid
      );
    });
  }
}
