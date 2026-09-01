import bcrypt from 'bcryptjs';
import { APP_DEFAULTS } from '../constants/index.js';

export async function hashPassword(plainPassword) {
  return bcrypt.hash(plainPassword, APP_DEFAULTS.SALT_ROUNDS);
}

export async function comparePassword(plainPassword, hashedPassword) {
  return bcrypt.compare(plainPassword, hashedPassword);
}
