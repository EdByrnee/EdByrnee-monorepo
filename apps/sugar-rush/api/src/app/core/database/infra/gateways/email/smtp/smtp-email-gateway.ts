import * as path from 'path';
import { Inject, Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ISmtpModuleConfig } from './smtp-module-config.interface';
import { ISendEmailCommand } from './interfaces/send-email-command.interface';
import { IEmailGatewayPort } from '../../../../ports/email-gateway.port';

@Injectable()
export class SmtpEmailGateway implements IEmailGatewayPort {
  transporter;

  constructor(
    private readonly mailerService: MailerService,
    @Inject('ISmtpModuleConfig')
    private readonly config: ISmtpModuleConfig
  ) {}

  public async sendEmail(
    to: string,
    subject: string,
    text: string = null,
    html: string = null
  ): Promise<void> {
    return this.mailerService.sendMail({
      to: to,
      subject: subject,
      text: text,
      html: html,
    });
  }

  public async sendEmailTemplate(
    to: string,
    subject: string,
    template: string,
    templateData
  ): Promise<void> {
    const templatePath = path.join(this.config.templatesDir, template);

    return this.mailerService.sendMail({
      to: to,
      subject: subject,
      template: templatePath,
      context: templateData,
    });
  }

  public async sendEmailTemplateWithAttachments(
    command: ISendEmailCommand
  ): Promise<void> {
    const templatePath = path.join(this.config.templatesDir, command.template);

    return this.mailerService.sendMail({
      to: command.to,
      subject: command.subject,
      template: templatePath,
      context: command.data,
      attachments: command.attachments,
    });
  }
}
