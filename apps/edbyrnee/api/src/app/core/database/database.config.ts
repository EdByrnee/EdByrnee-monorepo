import { IDatabaseConfig } from './db-config.interface';

const database = 'sugarrush';
const dialect = 'mysql';
const dialectModule = '';

export const databaseConfig: IDatabaseConfig = {
  development: {
    username: process.env.DB_USER || 'sugarrush',
    password: process.env.DB_PASS || 'Localdr0p1234',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || '3306',
    database: database,
    dialect: dialect,
    dialectModule: dialectModule,
  },
  test: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: database,
    dialect: dialect,
    dialectModule: dialectModule,
  },
  staging: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: database,
    dialect: dialect,
    dialectModule: dialectModule,
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: database,
    dialect: dialect,
    dialectModule: dialectModule,
  },
};
