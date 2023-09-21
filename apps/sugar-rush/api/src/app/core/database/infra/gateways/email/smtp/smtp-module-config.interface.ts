export interface ISmtpModuleConfig {
  host: string;
  port: number;
  secure: boolean;
  userName: string;
  password: string;
  fromAddress: string;
  templatesDir: string;
  preview: boolean;
  ignoreTLS?: boolean;
}
