import { Optional } from '@nestjs/common';
import { IsNumber, IsUUID } from 'class-validator';
import { IsNotEmpty, IsString } from 'class-validator';
import { IMessage } from '@shoppr-monorepo/api-interfaces';

export class NewMessageDto implements IMessage {
  @IsNumber()
  id?: number;

  @IsUUID()
  @IsNotEmpty()
  uuid: string;

  @IsString()
  @IsNotEmpty()
  message: string;

  @IsString()
  @IsNotEmpty()
  senderUuid: string;

  @IsString()
  @IsNotEmpty()
  recepientUuid: string;

  @IsString()
  @IsNotEmpty()
  @Optional()
  messageThreadId?: number;

  @IsString()
  @IsNotEmpty()
  @Optional()
  createdAt?: string;

  @IsString()
  @IsNotEmpty()
  @Optional()
  updatedAt?: string;
}
