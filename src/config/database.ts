import { Sequelize } from 'sequelize';
import { dbConfig } from './index';

const options = {
  dialect: 'postgres' as const,
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
};

export const sequelize = dbConfig.url 
  ? new Sequelize(dbConfig.url, options)
  : new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
      host: dbConfig.host,
      port: dbConfig.port,
      ...options
    });
