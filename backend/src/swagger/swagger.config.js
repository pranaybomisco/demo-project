import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { logger } from '../config/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const setupSwagger = (app) => {
  // Check location in src or dist
  let swaggerPath = path.resolve(__dirname, 'swagger.yaml');
  if (!fs.existsSync(swaggerPath)) {
    swaggerPath = path.resolve(__dirname, '../swagger/swagger.yaml');
  }

  try {
    const swaggerDocument = YAML.load(swaggerPath);
    app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    logger.info('Swagger Documentation mounted at /api/docs');
  } catch (err) {
    logger.warn('Could not load Swagger documentation:', { error: err.message });
  }
};
