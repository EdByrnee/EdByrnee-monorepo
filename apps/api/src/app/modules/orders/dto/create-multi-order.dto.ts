import { Optional } from '@nestjs/common';
import { DeliveryMethod, ICreateMultiOrder } from '@shoppr-monorepo/api-interfaces';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateMultiOrderDto implements ICreateMultiOrder {
  @IsNotEmpty()
  @IsUUID()
  uuid: string;

  @IsNotEmpty()
  @IsString()
  deliveryMethod: DeliveryMethod;

  @IsNotEmpty()
  dropUuids: string[];

  @Optional()
  qty?: number;

  @IsString()
  @IsNotEmpty()
  stripeToken: string;

  @IsString()
  @IsOptional()
  deliveryAddressLine1: string;

  @IsString()
  @IsOptional()
  deliveryAddressLine2: string;

  @IsString()
  @IsNotEmpty()
  deliveryAddressCity: string;

  @IsString()
  @IsNotEmpty()
  deliveryAddressPostcode: string;

  @IsString()
  @IsNotEmpty()
  deliveryAddressCountry: string;
}
