import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../core/database/database.module';
import { SequelizeUow } from '../../core/database/infra/sequelize-uow';
import { AuthModule } from '../auth/auth.module';
import { FilesModule } from '../files/files.module';
import { DropsController } from './drops.controller';
import { dropRepoProviders } from './drops.providers';
import { DropService } from './drops.service';

@Module({
  imports: [DatabaseModule, FilesModule, AuthModule],
  controllers: [DropsController],
  providers: [...dropRepoProviders, DropService, SequelizeUow],
  exports: [DropService],
})
export class DropsModule {}
