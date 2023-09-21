import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { DatabaseModule } from '../../core/database/database.module';
import { AuthController } from './auth.controller';
import { authProviders } from './auth.providers';
import { AuthService } from './auth.service';
import { EncryptionService } from './encryption.service';
import { FilesModule } from '../files/files.module';
import { JwtStrategy } from './utils/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtAuthGuard } from './utils/jwt-auth.guard';
import { SmtpEmailModule } from '../../core/database/infra/gateways/email/smtp/smtp-email.module';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import configuration from './config';
import { EmailService } from './email-service';
import { SequelizeUow } from '../../core/database/infra/sequelize-uow';
const authConfig = configuration();

@Module({
  controllers: [AuthController],
  imports: [
    SmtpEmailModule.forRoot(authConfig.smtpModule as any),
    DatabaseModule,
    PassportModule,
    FilesModule,
    JwtModule.register({
      secret: authConfig.jwt.secret,
      signOptions: { expiresIn: authConfig.jwt.expiresIn },
    }),
    ConfigModule
  ],
  providers: [
    AuthService,
    ...authProviders,
    EncryptionService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    JwtStrategy,
    EmailService,
    SequelizeUow
  ],
  exports: [AuthService, EmailService],
})
export class AuthModule {}
