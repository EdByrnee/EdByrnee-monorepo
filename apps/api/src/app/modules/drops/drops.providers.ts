import { SequelizeRepo } from '../../core/database/infra/sequelize-repo';
import { DropPhoto } from './entities/drop-photo.entity';
import { Drop } from './entities/drop.entity';

export const DROP_REPOSITORY = 'DROP_REPOSITORY';
export const DROP_PHOTO_REPOSITORY = 'DROP_PHOTO_REPOSITORY';

export const dropRepoProviders = [
  {
    provide: DROP_REPOSITORY,
    useFactory: () => new SequelizeRepo<Drop>(Drop, [DropPhoto]),
  },
  {
    provide: DROP_PHOTO_REPOSITORY,
    useFactory: () => new SequelizeRepo<DropPhoto>(DropPhoto),
  },
];
