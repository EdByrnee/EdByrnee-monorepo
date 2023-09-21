import { INewMessage } from '@shoppr-monorepo/api-interfaces';
import { IsUUID } from 'class-validator';
import { IsNotEmpty, IsString } from 'class-validator';

export class NewMessageDto implements INewMessage {
  @IsUUID()
  uuid: string;

  @IsString()
  @IsNotEmpty()
  messageBody: string;

  @IsString()
  @IsNotEmpty()
  recepientUuid;
}
