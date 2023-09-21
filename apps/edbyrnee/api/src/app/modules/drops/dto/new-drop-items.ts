import { IsOptional, IsDateString, IsUUID } from 'class-validator';
import { IsNotEmpty } from 'class-validator';
import { ICreateDropItem } from '@shoppr-monorepo/api-interfaces';

export class CreateDropItemDto implements ICreateDropItem {
  @IsUUID()
  @IsNotEmpty()
  uuid: string;

  @IsOptional()
  @IsDateString()
  expirationDate: string | null;
}
