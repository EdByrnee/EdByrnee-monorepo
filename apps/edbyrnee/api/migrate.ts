import * as dotenv from 'dotenv';
dotenv.config({ path: 'apps/api/.env' });
dotenv.config({ path: 'apps/api/.env.local' });

import * as path from 'path';
import * as childProcess from 'child_process';
import * as Promise from 'bluebird';
import * as Umzug from 'umzug';
import { Sequelize } from 'sequelize-typescript';
import { databaseConfig } from './src/app/core/database/database.config';

const cmd: string = process.argv[2].trim().split('--')[0];
const cmdArg: string = process.argv[2].trim().split('--')[1];

const DB_NAME = process.env.DB_NAME;
const DB_USER = process.env.DB_USER;

let config; 

try {
  switch (process.env.APP_ENV) {
    case 'production':
      console.log(`Migrating environment ${process.env.APP_ENV}`);
      config = databaseConfig.production;
      break;
    case 'staging':
      console.log(`Migrating environment ${process.env.APP_ENV}`);
      config = databaseConfig.staging;
      break;
    case 'test':
      console.log(`Migrating environment ${process.env.APP_ENV}`);
      config = databaseConfig.test;
      break;
    case 'dev':
    case 'development':
      console.log(`Migrating environment ${process.env.APP_ENV}`);
      config = databaseConfig.development;
      break;
    default:
      console.log(`Migrating environment development`);
      config = databaseConfig.development;
      break;
  }
} catch {
  console.log(`Could not load database.config`);
  config = {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: 'localshelf',
    dialect: 'mysql',
    dialectModule: '',
  };
}

console.log(`Server: ${config.host}`);
console.log(`Database: ${config.database}`);

let migrationsPath = 'apps/api/migrations';

if (process.argv.length == 4) {
  migrationsPath = process.argv[3].trim();
}

/* e.g. */
if (cmdArg === 'admin') {
  console.log('Running migration script in admin mode!');
  config.username = process.env.DB_USER_ADMIN;
  config.password = process.env.DB_PASS_ADMIN;
}

console.log(`Executing migrations at ${migrationsPath}`);

console.log(`Using database ${config.database} on ${config.host} as ${config.username}`)

const sequelize = new Sequelize(config);

const umzug = new Umzug({
  storage: 'sequelize',
  storageOptions: { sequelize },

  // see: https://github.com/sequelize/umzug/issues/17
  migrations: {
    params: [
      sequelize,
      sequelize.constructor, // DataTypes
      function () {
        throw new Error(
          'Migration tried to use old style "done" callback. Please upgrade to "umzug" and return a promise instead.'
        );
      },
    ],
    path: migrationsPath,
    pattern: /\.ts$/,
  },

  logging: function (...args) {
    console.log.apply(null, args);
  },
});

function logUmzugEvent(eventName) {
  return function (name) {
    console.log(`${name} ${eventName}`);
  };
}
umzug.on('migrating', logUmzugEvent('migrating'));
umzug.on('migrated', logUmzugEvent('migrated'));
umzug.on('reverting', logUmzugEvent('reverting'));
umzug.on('reverted', logUmzugEvent('reverted'));

function cmdStatus() {
  const result: any = {};

  return umzug
    .executed()
    .then((executed) => {
      result.executed = executed;
      return umzug.pending();
    })
    .then((pending) => {
      result.pending = pending;
      return result;
    })
    .then(({ executed, pending }) => {
      executed = executed.map((m) => {
        m.name = path.basename(m.file, '.ts');
        return m;
      });
      pending = pending.map((m) => {
        m.name = path.basename(m.file, '.ts');
        return m;
      });

      const current =
        executed.length > 0 ? executed[0].file : '<NO_MIGRATIONS>';
      const status = {
        current: current,
        executed: executed.map((m) => m.file),
        pending: pending.map((m) => m.file),
      };

      console.log(JSON.stringify(status, null, 2));

      return { executed, pending };
    });
}

function cmdMigrate() {
  return umzug.up();
}

function cmdMigrateNext() {
  return cmdStatus().then(({ pending }) => {
    if (pending.length === 0) {
      return Promise.reject(new Error('No pending migrations'));
    }
    const next = pending[0].name;
    return umzug.up({ to: next });
  });
}

function cmdReset() {
  return umzug.down({ to: 0 });
}

function cmdResetPrev() {
  return cmdStatus().then(({ executed }) => {
    if (executed.length === 0) {
      return Promise.reject(new Error('Already at initial state'));
    }
    const prev = executed[executed.length - 1].name;
    return umzug.down({ to: prev });
  });
}

function cmdHardReset() {
  return new Promise((resolve, reject) => {
    setImmediate(() => {
      try {
        console.log(`dropdb ${DB_NAME}`);
        childProcess.spawnSync(`dropdb ${DB_NAME}`);
        console.log(`createdb ${DB_NAME} --username ${DB_USER}`);
        childProcess.spawnSync(`createdb ${DB_NAME} --username ${DB_USER}`);
        resolve();
      } catch (e) {
        console.log(e);
        reject(e);
      }
    });
  });
}

let executedCmd;

console.log(`${cmd.toUpperCase()} BEGIN`);
switch (cmd) {
  case 'status':
    executedCmd = cmdStatus();
    break;

  case 'up':
  case 'migrate':
    executedCmd = cmdMigrate();
    break;

  case 'next':
  case 'migrate-next':
    executedCmd = cmdMigrateNext();
    break;

  case 'down':
  case 'reset':
    executedCmd = cmdReset();
    break;

  case 'prev':
  case 'reset-prev':
    executedCmd = cmdResetPrev();
    break;

  case 'reset-hard':
    executedCmd = cmdHardReset();
    break;

  default:
    console.log(`invalid cmd: ${cmd}`);
    process.exit(1);
}

executedCmd
  .then(() => {
    const doneStr = `${cmd.toUpperCase()} DONE`;
    console.log(doneStr);
    console.log(
      '=============================================================================='
    );
  })
  .catch((err) => {
    const errorStr = `${cmd.toUpperCase()} ERROR`;
    console.log(errorStr);
    console.log(
      '=============================================================================='
    );
    console.log(err);
    console.log(
      '=============================================================================='
    );
    return Promise.reject(err);
  })
  .then(
    () => {
      if (cmd !== 'status' && cmd !== 'reset-hard') {
        return cmdStatus();
      }
      return Promise.resolve();
    },
    (err) => {
      console.log(err);
      process.exit(1);
    }
  )
  .then(() => process.exit(0));
