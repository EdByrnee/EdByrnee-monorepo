import { Optional } from '@nestjs/common';
import { DeliveryMethod, ICreateOrder } from '@shoppr-monorepo/api-interfaces';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateOrderDto implements ICreateOrder {
  @IsNotEmpty()
  @IsUUID()
  uuid: string;

  @IsNotEmpty()
  @IsString()
  deliveryMethod: DeliveryMethod;

  @IsNotEmpty()
  dropUuid: string;

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
