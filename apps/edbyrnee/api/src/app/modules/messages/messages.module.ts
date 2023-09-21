import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../core/database/database.module';
import { MessagesController } from './messages.controller';
import { messageModuleRepositoryProviders } from './messages.providers';
import { MessagesService } from './messages.service';
import { AuthModule } from '../auth/auth.module';
import { SequelizeUow } from '../../core/database/infra/sequelize-uow';
import { FirebaseAdminModule } from '@aginix/nestjs-firebase-admin';
import * as admin from 'firebase-admin';
import { NotificationService } from './notification.service';

import { serviceAccount } from './fire-base-service-account';

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    FirebaseAdminModule.forRootAsync({
      useFactory: () => ({
        credential: admin.credential.cert(serviceAccount as any),
      }),
    }),
  ],
  controllers: [MessagesController],
  providers: [
    MessagesService,
    NotificationService,
    ...messageModuleRepositoryProviders,
    SequelizeUow,
  ],
  exports: [],
})
export class MessagesModule {}
