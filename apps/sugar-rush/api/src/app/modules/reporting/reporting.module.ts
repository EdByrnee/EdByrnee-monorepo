import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../core/database/database.module';
import { SequelizeUow } from '../../core/database/infra/sequelize-uow';
import { AuthModule } from '../auth/auth.module';
import { ReportingController } from './reporting.controller';
import { reportingProviders } from './reporting.providers';
import { ReportingService } from './reporting.service';
@Module({
  imports: [AuthModule, DatabaseModule],
  controllers: [ReportingController],
  providers: [...reportingProviders, ReportingService, SequelizeUow],
  exports: [],
})
export class ReportingModule {}
