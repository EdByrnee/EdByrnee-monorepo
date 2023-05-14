import { ISendEmailCommand } from '../infra/gateways/email/smtp/interfaces/send-email-command.interface';

export interface IEmailGatewayPort {
  sendEmail(
    to: string,
    subject: string,
    text?: string,
    html?: string
  ): Promise<void>;

  sendEmailTemplate(
    to: string,
    subject: string,
    template: string,
    templateData
  ): Promise<void>;

  sendEmailTemplateWithAttachments(command: ISendEmailCommand): Promise<void>;
}
