import * as path from 'path';

export default () => {
  let config: Iconfig;

  const defaultEmailTemplateDir = path.join(
    __dirname,
    'assets',
    'auth',
    'templates'
  );
  const emailTemplateDir =
    process.env.SMTP_TEMPLATES || defaultEmailTemplateDir;

  switch (process.env.APP_ENV) {
    case 'DEVELOPMENT':
      config = {
        jwt: {
          secret: 'some-super-secret',
          expiresIn: '7d',
        },
        smtpModule: {
          host: process.env.MAILDEV_HOST,
          port: Number(process.env.MAILDEV_PORT),
          secure: false,
          preview: true,
          userName: process.env.MAILDEV_INCOMING_USER,
          password: process.env.MAILDEV_INCOMING_PASS,
          fromAddress: process.env.MAILDEV_FROM_ADDRESS,
          templatesDir: emailTemplateDir
        },
      };
      break;
    case 'PRODUCTION':
      config = {
        jwt: {
          secret: 'some-super-secret',
          expiresIn: '7d',
        },
        smtpModule: {
          host: process.env.MAILDEV_HOST,
          port: Number(process.env.MAILDEV_PORT),
          secure: false,
          userName: process.env.MAILDEV_INCOMING_USER,
          password: process.env.MAILDEV_INCOMING_PASS,
          fromAddress: process.env.MAILDEV_FROM_ADDRESS,
          templatesDir: emailTemplateDir,
          preview: true,
        },
      };
      break;
    default:
      config = {
        jwt: {
          secret: 'some-super-secret',
          expiresIn: '7d',
        },
        smtpModule: {
          host: 'localhost',
          port: 1025,
          secure: false,
          userName: process.env.MAILDEV_INCOMING_USER,
          password: process.env.MAILDEV_INCOMING_PASS,
          fromAddress: '"Local Shelf" <ed_b@hotmail.co.uk>',
          templatesDir: emailTemplateDir,
          preview: true,
        },
      };
  }

  return config;
};

export interface Iconfig {
  jwt: IJwtConfig;
  smtpModule: ISmtpModuleConfig;
}
export interface IJwtConfig {
  secret: string;
  expiresIn: string;
}
export interface ISmtpModuleConfig {
  host: string;
  port: number;
  secure: boolean;
  debug?: boolean;
  logger?: boolean;
  ignoreTLS?: boolean;
  userName?: string;
  password?: string;
  fromAddress: string;
  templatesDir: string;
  preview: boolean;
  auth?: any;
}
