import { IUserProfile } from '@shoppr-monorepo/api-interfaces';
import { plainToClass, Transform, Type } from 'class-transformer';
import { IsNotEmpty, ValidateNested } from 'class-validator';

export class UpdateProfilePhotosDto {
  // Transform to array
  @Transform(({ value }) => JSON.parse(value))
  @IsNotEmpty()
  imageUuidsToRemove: string[];

  // Transform to array
  @Transform(({ value }) => JSON.parse(value))
  @IsNotEmpty()
  userProfileUpdates: Partial<IUserProfile>;
}
