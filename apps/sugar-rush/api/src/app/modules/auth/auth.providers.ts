import { SequelizeRepo } from '../../core/database/infra/sequelize-repo';
import { PasswordResetToken } from './entities/user-password-reset-token';
import { UserPhoto } from './entities/user-photos.entity';
import { UserProfile } from './entities/user-profile.entity';
import { UserRole } from './entities/user-role.entity';

export const USER_REPO = 'USER_REPO';
export const PASSWORD_RESET_TOKEN_REPO = 'PASSWORD_RESET_TOKEN_REPO';
export const USER_PHOTOS_REPO = 'USER_PHOTOS_REPO';
export const USER_ROLE_REPO = 'USER_ROLE_REPO';

export const authProviders = [
  {
    provide: USER_REPO,
    useFactory: () => new SequelizeRepo<UserProfile>(UserProfile, [UserPhoto, UserRole]),
  },
  {
    provide: PASSWORD_RESET_TOKEN_REPO,
    useFactory: () => new SequelizeRepo<UserProfile>(PasswordResetToken),
  },
  {
    provide: USER_PHOTOS_REPO,
    useFactory: () => new SequelizeRepo<UserPhoto>(UserPhoto),
  },
  {
    provide: USER_ROLE_REPO,
    useFactory: () => new SequelizeRepo<UserRole>(UserRole, UserProfile),
  }
];
