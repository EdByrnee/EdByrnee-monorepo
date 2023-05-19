import { SequelizeRepo } from '../../core/database/infra/sequelize-repo';
import { DropItem } from './entities/drop-item';
import { DropItemLocation } from './entities/drop-item-location';
import { DropPhoto } from './entities/drop-photo.entity';
import { Drop } from './entities/drop.entity';

export const DROP_REPOSITORY = 'DROP_REPOSITORY';
export const DROP_PHOTO_REPOSITORY = 'DROP_PHOTO_REPOSITORY';
export const DROP_ITEM_REPO = 'DROP_ITEM_REPO';
export const DROP_ITEM_LOCATION_REPO = 'DROP_ITEM_LOCATION_REPO';
// export const DROP_ITEM_LOACTION_SUMMARY_REPO = 'DROP_ITEM_LOACTION_SUMMARY_REPO';

export const dropRepoProviders = [
  {
    provide: DROP_REPOSITORY,
    useFactory: () =>
      new SequelizeRepo<Drop>(Drop, [
        DropPhoto,
        {
          model: DropItem,
          include: [DropItemLocation],
        },
      ]),
  },
  {
    provide: DROP_PHOTO_REPOSITORY,
    useFactory: () => new SequelizeRepo<DropPhoto>(DropPhoto),
  },
  {
    provide: DROP_ITEM_REPO,
    useFactory: () => new SequelizeRepo<DropItem>(DropItem),
  },
  {
    provide: DROP_ITEM_LOCATION_REPO,
    useFactory: () => new SequelizeRepo<DropItemLocation>(DropItemLocation),
  },
  // {
  //   provide: DROP_ITEM_LOACTION_SUMMARY_REPO,
  //   useFactory: () => new SequelizeRepo<DropItemLocation>(DropItemLocation),
  // }
];
