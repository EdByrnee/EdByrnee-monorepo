import { SequelizeRepo } from '../../core/database/infra/sequelize-repo';
import { FileEntity } from './file.entity';

export const FILE_REPOSITORY = 'FILE_REPOSITORY';
export const FILE_STORAGE = 'FILE_STORAGE';

export const fileModuleRepositoryProviders = [
  {
    provide: FILE_REPOSITORY,
    useFactory: () => new SequelizeRepo<FileEntity>(FileEntity),
  },
];

export const FILE_ENTITIES = [FileEntity];