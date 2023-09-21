import { Inject, Injectable } from '@nestjs/common';
import { IRepositoryPort } from '../../core/database/ports/repository-port';
import { CONFIG_KVP_REPO } from './config.providers';
import { ConfigKeyValuePair } from './entities/config-key-value-pair';

@Injectable()
export class ConfigService {
  constructor(
    @Inject(CONFIG_KVP_REPO)
    private readonly remoteConfigRepo: IRepositoryPort<ConfigKeyValuePair>
  ) {}

  async getMobileAppConfig() {
    const config = await this.remoteConfigRepo.findOne({
        key: 'mobileAppConfig',
    });

    return config.value;
  }
}
