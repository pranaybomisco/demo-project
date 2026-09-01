import { createApp } from '../src/app.js';
import { initDb } from '../src/models/index.js';

let isDbInitialized = false;
const app = createApp();

export default async function handler(req, res) {
  if (!isDbInitialized) {
    try {
      await initDb();
      isDbInitialized = true;
    } catch (err) {
      console.error('Database initialization warning on Vercel:', err.message);
    }
  }
  return app(req, res);
}
