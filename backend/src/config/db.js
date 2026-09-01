import { Sequelize } from 'sequelize';
import { config } from './env.js';
import { logger } from './logger.js';
import { ENVIRONMENTS, SERVER_MESSAGES } from '../constants/index.js';

export const sequelize = new Sequelize(config.DATABASE_URL, {
  dialect: 'postgres',
  logging: false,
  dialectOptions: config.NODE_ENV === ENVIRONMENTS.PRODUCTION ? {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  } : {},
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

export const connectDb = async () => {
  try {
    await sequelize.authenticate();
    logger.info(SERVER_MESSAGES.POSTGRES_AUTHENTICATED);
  } catch (error) {
    logger.error(SERVER_MESSAGES.UNABLE_TO_CONNECT_DB, { error: error.message });
    throw error;
  }
};
