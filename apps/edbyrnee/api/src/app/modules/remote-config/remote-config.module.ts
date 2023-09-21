import { forwardRef, Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { RemoteConfigController } from './remote-config.controller';
import { configProviders } from './config.providers';
import { ConfigService } from './config.service';

@Module({
  imports: [forwardRef(() => AuthModule)],
  providers: [ConfigService, ...configProviders],
  controllers: [RemoteConfigController],
  exports: [ConfigService],
})
export class RemoteConfigModule {}
