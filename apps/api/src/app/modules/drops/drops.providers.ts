import { SequelizeRepo } from '../../core/database/infra/sequelize-repo';
import { DropInventoryAssignment } from './entities/drop-inventory-assignment';
import { DropPhoto } from './entities/drop-photo.entity';
import { Drop } from './entities/drop.entity';

export const DROP_REPOSITORY = 'DROP_REPOSITORY';
export const DROP_PHOTO_REPOSITORY = 'DROP_PHOTO_REPOSITORY';
export const DROP_INVENTORY_ASSIGNMENT_REPOSITORY =
  'DROP_INVENTORY_ASSIGNMENT_REPOSITORY';

export const dropRepoProviders = [
  {
    provide: DROP_REPOSITORY,
    useFactory: () => new SequelizeRepo<Drop>(Drop, [DropPhoto]),
  },
  {
    provide: DROP_PHOTO_REPOSITORY,
    useFactory: () => new SequelizeRepo<DropPhoto>(DropPhoto),
  },
  {
    provide: DROP_INVENTORY_ASSIGNMENT_REPOSITORY,
    useFactory: () =>
      new SequelizeRepo<DropInventoryAssignment>(DropInventoryAssignment),
  },
  {
    provide: DROP_INVENTORY_ASSIGNMENT_REPOSITORY,
    useFactory: () =>
      new SequelizeRepo<DropInventoryAssignment>(DropInventoryAssignment),
  }
];
