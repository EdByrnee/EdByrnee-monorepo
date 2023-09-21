import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './core/database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { DropsModule } from './modules/drops/drops.module';
import { OrdersModule } from './modules/orders/orders.module';
import { FilesModule } from './modules/files/files.module';
import { MessagesModule } from './modules/messages/messages.module';
import { ConfigModule } from '@nestjs/config';
import configuration from './modules/auth/config';
import { ReportingModule } from './modules/reporting/reporting.module';
import { RemoteConfigModule } from './modules/remote-config/remote-config.module';

@Module({
  imports: [
    DatabaseModule,
    ConfigModule.forRoot({
      envFilePath: ['apps/api/.env', 'apps/api/.env.local'],
      load: [configuration],
      cache: true,
    }),
    // createAdminModule(),
    AuthModule,
    DropsModule,
    OrdersModule,
    FilesModule,
    MessagesModule,
    ReportingModule,
    RemoteConfigModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
