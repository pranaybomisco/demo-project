import dotenv from 'dotenv';
import { ENV_VARS, ERROR_MESSAGES, APP_DEFAULTS } from '../constants/index.js';

dotenv.config();

const requiredEnvVars = [
  ENV_VARS.DATABASE_URL,
  ENV_VARS.JWT_SECRET,
  ENV_VARS.PORT,
  ENV_VARS.NODE_ENV,
  ENV_VARS.JWT_EXPIRES_IN,
  ENV_VARS.CORS_ORIGIN,
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(ERROR_MESSAGES.MISSING_ENV_VAR(envVar));
  }
}

export const config = {
  PORT: parseInt(process.env[ENV_VARS.PORT], APP_DEFAULTS.RADIX_10),
  NODE_ENV: process.env[ENV_VARS.NODE_ENV],
  DATABASE_URL: process.env[ENV_VARS.DATABASE_URL],
  JWT_SECRET: process.env[ENV_VARS.JWT_SECRET],
  JWT_EXPIRES_IN: process.env[ENV_VARS.JWT_EXPIRES_IN],
  CORS_ORIGIN: process.env[ENV_VARS.CORS_ORIGIN],
};
