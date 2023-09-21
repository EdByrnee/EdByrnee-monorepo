import * as fs from 'fs'
import { DynamicModule, Logger, Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { SmtpEmailGateway } from './smtp-email-gateway';
import { ISmtpModuleConfig } from './smtp-module-config.interface';
import { EMAIL_GATEWAY } from './email-gateway.injection-tokens';

@Module({})
export class SmtpEmailModule {
  static forRoot(
    config: ISmtpModuleConfig
  ): DynamicModule {

    const logger = new Logger('SmtpEmailModule');
    logger.log(`Using template dir ${config.templatesDir} for emails`);

    if (fs.existsSync(config.templatesDir)) {
      fs.readdirSync(config.templatesDir).forEach(file => {
        logger.log(file);
      });
    }

    return {
      module: SmtpEmailModule,
      imports: [
        MailerModule.forRootAsync({
          useFactory: () => ({
            transport: {
              host: config.host,
              port: config.port,
              secure: config.secure,
              ignoreTLS: config.ignoreTLS,
              auth: {
                user: config.userName,
                pass: config.password,
              },
            },
            defaults: {
              from: config.fromAddress,
            },
            template: {
              dir: config.templatesDir,
              adapter: new HandlebarsAdapter(),
              options: {
                strict: true,
              },
            },
            preview: config.preview
          }),
        }),
      ],
      providers: [
        {
          provide: EMAIL_GATEWAY,
          useClass: SmtpEmailGateway,
        },
        {
          provide: 'ISmtpModuleConfig',
          useValue: config,
        },
      ],
      exports: [EMAIL_GATEWAY],
    };
  }
}
