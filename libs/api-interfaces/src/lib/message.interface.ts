export interface IMessage {
  id?: number;
  uuid: string;
  message: string;
  senderUuid: string;
  recepientUuid: string;
  messageThreadId?: number;
  createdAt?: string;
  updatedAt?: string;
  sender?: boolean;
}
