import { SequelizeRepo } from '../../core/database/infra/sequelize-repo';
import { DelliDropQtySnapshot } from './entities/delli-drop-qty';
import { DelliDrop } from './entities/delli-drop.entity';
import { ScrapeLog } from './entities/scrape-log';
import { TokenLog } from './entities/token-log';

export const DELLI_DROP_REPO = 'DELLI_DROP_REPO';
export const DELLI_STOCK_REPO = 'DELLI_STOCK_REPO';
export const TOKEN_LOG_REPO = 'TOKEN_LOG_REPO';
export const SCRAPE_LOG_REPO = 'SCRAPE_LOG_REPO';

export const reportingProviders = [
  {
    provide: DELLI_DROP_REPO,
    useFactory: () =>
      new SequelizeRepo<DelliDrop>(DelliDrop, [DelliDropQtySnapshot]),
  },
  {
    provide: DELLI_STOCK_REPO,
    useFactory: () =>
      new SequelizeRepo<DelliDropQtySnapshot>(DelliDropQtySnapshot),
  },
  {
    provide: TOKEN_LOG_REPO,
    useFactory: () => new SequelizeRepo<TokenLog>(TokenLog),
  },
  {
    provide: SCRAPE_LOG_REPO,
    useFactory: () => new SequelizeRepo<ScrapeLog>(ScrapeLog),
  }
];

export const REPORTING_ENTITIES = [
  DelliDrop,
  DelliDropQtySnapshot,
  TokenLog,
  ScrapeLog,
];
