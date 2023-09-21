import { Controller, Get } from '@nestjs/common';
import { Public } from '../auth/utils/no-auth.attribute';
import { ConfigService } from './config.service';
@Controller('remote-config')
export class RemoteConfigController {
  constructor(private remoteConfigService: ConfigService) {}

  @Public()
  @Get('mobile-app')
  async getMobileAppConfig() {
    return await this.remoteConfigService.getMobileAppConfig();
  }
}
