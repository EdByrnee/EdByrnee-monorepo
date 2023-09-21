import { INewDrop } from '@shoppr-monorepo/api-interfaces';
import {
  IsArray,
  IsBoolean,
  IsInt,
  IsNumber,
  IsOptional,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { plainToClass, Transform, Type } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
import { Optional } from '@nestjs/common';

export class NewDropDto implements INewDrop {
  @IsUUID()
  uuid: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @IsNotEmpty()
  price: string;

  @IsInt()
  @IsNotEmpty()
  qty_available: string;

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
  localDeliveryCost?: string;

  @IsString()
  @IsOptional()
  localDeliveryGuidelines?: string;

  @IsNumber()
  @IsOptional()
  nationalDeliveryCost?: string;

  @IsString()
  @IsOptional()
  nationalDeliveryGuidelines?: string;

  @IsNumber()
  @IsOptional()
  collectionCost?: string;

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
  @IsNotEmpty()
  itemCode: string;
}

export class CreateDropDto {
  @ValidateNested({ each: true })
  @Transform(({ value }) => plainToClass(NewDropDto, JSON.parse(value)))
  @Type(() => NewDropDto)
  @IsNotEmpty()
  drop: NewDropDto;
}
