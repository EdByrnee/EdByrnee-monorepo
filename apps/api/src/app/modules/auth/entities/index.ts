import { EmailValidationToken } from './user-email-validation-token';
import { PasswordResetToken } from './user-password-reset-token';
import { UserProfile } from './user-profile.entity';
import { UserRole } from './user-role.entity';
import { UserPhoto } from './user-photos.entity';

export const AUTH_ENTITIES = [
  EmailValidationToken,
  PasswordResetToken,
  UserProfile,
  UserRole,
  UserPhoto
];
