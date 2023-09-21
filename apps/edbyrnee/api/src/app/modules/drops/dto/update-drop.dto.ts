
import {
  IsBoolean,
  IsInt,
  IsNumber,
  IsOptional,
  ValidateNested,
  IsArray
} from 'class-validator';
import { plainToClass, Transform, Type } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
import { DropStatus, IUpdateDrop } from '@shoppr-monorepo/api-interfaces';

export class DropUpdatesDto implements IUpdateDrop {

  @IsArray()
  imageUuidsToRemove: string[];

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  description: string;

  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  price: number;

  @IsInt()
  @IsNotEmpty()
  @IsOptional()
  qty_available: number;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  size?: string;

  @IsString()
  @IsNotEmpty()
  ingredients: string;

  @IsString()
  @IsNotEmpty()
  allergens: string;

  @IsBoolean()
  @IsNotEmpty()
  age_restricted: boolean;

  @IsBoolean()
  @IsOptional()
  localDeliveryEnabled: boolean;

  @IsBoolean()
  @IsOptional()
  nationalDeliveryEnabled: boolean;

  @IsBoolean()
  @IsOptional()
  collectionEnabled: boolean;

  @IsNumber()
  @IsOptional()
  localDeliveryCost?: number;

  @IsString()
  @IsOptional()
  localDeliveryGuidelines?: string;

  @IsNumber()
  @IsOptional()
  nationalDeliveryCost?: number;

  @IsString()
  @IsOptional()
  nationalDeliveryGuidelines?: string;

  @IsNumber()
  @IsOptional()
  collectionCost?: number;

  @IsString()
  @IsOptional()
  collectionGuidelines?: string;

  @IsString()
  @IsOptional()
  collectionAddressLine1?: string;

  @IsString()
  @IsOptional()
  collectionAddressLine2?: string;

  @IsString()
  @IsOptional()
  collectionAddressCity?: string;

  @IsString()
  @IsOptional()
  collectionAddressPostcode?: string;

  @IsNumber()
  @IsOptional()
  localDeliveryLat?: number;

  @IsOptional()
  @IsNumber()
  localDeliveryLng?: number;

  @IsNumber()
  @IsOptional()
  localDeliveryRadius?: number;

  @IsString()
  @IsOptional()
  status: DropStatus;
}

export class UpdateDropDto {
  @ValidateNested({ each: true })
  @Transform(({ value }) => plainToClass(DropUpdatesDto, JSON.parse(value)))
  @Type(() => DropUpdatesDto)
  @IsNotEmpty()
  updates: DropUpdatesDto;
}
