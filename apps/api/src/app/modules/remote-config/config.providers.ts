import { SequelizeRepo } from '../../core/database/infra/sequelize-repo';
import { ConfigKeyValuePair } from './entities/config-key-value-pair';
export const CONFIG_KVP_REPO = 'CONFIG_KVP_REPO';

export const configProviders = [
  {
    provide: CONFIG_KVP_REPO,
    useFactory: () =>
      new SequelizeRepo<ConfigKeyValuePair>(ConfigKeyValuePair, [
      ]),
  },
];
