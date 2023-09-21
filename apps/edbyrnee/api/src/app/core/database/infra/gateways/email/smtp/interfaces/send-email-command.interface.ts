import { IAttachmentEmail } from "./attachment-email.interface";

export interface ISendEmailCommand {
    to: string;
    subject: string;
    template: string;
    data: any,
    attachments: IAttachmentEmail[]
}