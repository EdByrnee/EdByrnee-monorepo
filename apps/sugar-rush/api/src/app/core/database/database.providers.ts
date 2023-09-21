import { Sequelize } from 'sequelize-typescript';
import { AUTH_ENTITIES } from '../../modules/auth/entities';
import { CONFIG_ENTITIES } from '../../modules/remote-config/entities';
import { DROP_ENTITIES } from '../../modules/drops/entities';
import { FILE_ENTITIES } from '../../modules/files/files.providers';
import { MESSAGES_ENTITIES } from '../../modules/messages/messages.providers';
import { ORDER_ENTITIES } from '../../modules/orders/orders.providers';
import { REPORTING_ENTITIES } from '../../modules/reporting/reporting.providers';
import { SEQUELIZE, DEVELOPMENT, TEST, PRODUCTION } from './constants';
import { databaseConfig } from './database.config';
export const databaseProviders = [
  {
    provide: SEQUELIZE,
    useFactory: async () => {
      let config;
      switch (process.env.APP_ENV) {
        case DEVELOPMENT:
          config = databaseConfig.development;
          break;
        case TEST:
          config = databaseConfig.test;
          break;
        case PRODUCTION:
          config = databaseConfig.production;
          break;
        default:
          config = databaseConfig.development;
      }

      config.logging = false;
      const sequelize = new Sequelize(config);
      sequelize.addModels([
        ...AUTH_ENTITIES,
        ...DROP_ENTITIES,
        ...ORDER_ENTITIES,
        ...FILE_ENTITIES,
        ...MESSAGES_ENTITIES,
        ...REPORTING_ENTITIES,
        ...CONFIG_ENTITIES
      ]);

      await sequelize.sync();

      return sequelize;
    },
  },
];
