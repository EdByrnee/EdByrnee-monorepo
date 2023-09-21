import { ApiTags } from '@nestjs/swagger';
import { Controller, Get, Logger } from '@nestjs/common';
import { ReportingService } from './reporting.service';
import { Cron } from '@nestjs/schedule';
import { Public } from '../auth/utils/no-auth.attribute';
import { SequelizeUow } from '../../core/database/infra/sequelize-uow';

@ApiTags('Reporting')
@Controller('reporting')
export class ReportingController {
  private readonly Logger = new Logger(ReportingController.name);

  constructor(
    private uow: SequelizeUow,
    private reportingService: ReportingService
    ) {}

  @Public()
  @Cron('0 3 * * *')
  @Get('delli-drops/scrape')
  async scrapeDelliDrops() {
    return await this.uow.execute(async () => {
    this.Logger.log('Scraping Delli Drops');
    return await this.reportingService.scrapeDelliDrops();
    });
  }

  @Get('delli-drops')
  async listDrops() {
    const delliDrops = await this.reportingService.getDelliDrops();
    return delliDrops;
  }

  @Get('scrape-logs')
  async getScrapeLogs(){
    const scrapeLogs = await this.reportingService.getScrapeLogs();
    return scrapeLogs;
  }
}
