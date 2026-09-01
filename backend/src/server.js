import { createApp } from './app.js';
import { config } from './config/env.js';
import { logger } from './config/logger.js';
import { initDb } from './models/index.js';
import { SERVER_MESSAGES, SWAGGER_CONFIG } from './constants/index.js';

const app = createApp();

async function startServer() {
  try {
    // Ensure database connection and Sequelize model schema sync
    await initDb();
    logger.info(SERVER_MESSAGES.MODELS_SYNCED);

    app.listen(config.PORT, () => {
      logger.info(`Server running on http://localhost:${config.PORT} | Docs: http://localhost:${config.PORT}${SWAGGER_CONFIG.DOCS_PATH}`);
    });
  } catch (err) {
    logger.error(`${SERVER_MESSAGES.DB_CONNECTION_FAILED}: ${err.message || err.name}`);
    logger.warn(`${SERVER_MESSAGES.ENSURE_POSTGRES_RUNNING}${config.DATABASE_URL.replace(/:[^:@]+@/, ':****@')}`);
    logger.warn(SERVER_MESSAGES.DOCKER_START_HINT);
    process.exit(1);
  }
}

startServer();
