import { Umzug, SequelizeStorage } from 'umzug';
import { sequelize } from '../config/database';
import path from 'path';

export const migrator = new Umzug({
  migrations: {
    glob: path.join(__dirname, './migrations/*.ts'),
  },
  context: sequelize.getQueryInterface(),
  storage: new SequelizeStorage({ sequelize, tableName: 'migrations' }),
  logger: console,
});

export type Migration = typeof migrator._types.migration;



