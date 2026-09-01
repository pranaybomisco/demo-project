import { config } from './env.js';
import { LOG_LEVELS } from '../constants/index.js';

const COLOR_CODES = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  green: '\x1b[32m',
  cyan: '\x1b[36m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  gray: '\x1b[90m',
  bold: '\x1b[1m',
};

const LEVEL_CONFIG = {
  [LOG_LEVELS.ERROR]: { color: COLOR_CODES.red, tag: 'ERROR', severity: 0 },
  [LOG_LEVELS.WARN]:  { color: COLOR_CODES.yellow, tag: 'WARN ', severity: 1 },
  [LOG_LEVELS.INFO]:  { color: COLOR_CODES.green, tag: 'INFO ', severity: 2 },
  [LOG_LEVELS.HTTP]:  { color: COLOR_CODES.cyan, tag: 'HTTP ', severity: 3 },
  [LOG_LEVELS.DEBUG]: { color: COLOR_CODES.gray, tag: 'DEBUG', severity: 4 },
};

class Logger {
  constructor() {
    this.isProduction = config.NODE_ENV === 'production';
    const envLevel = (process.env.LOG_LEVEL || (this.isProduction ? 'info' : 'debug')).toLowerCase();
    this.currentSeverity = LEVEL_CONFIG[envLevel]?.severity ?? 4;
  }

  getTimestamp() {
    const now = new Date();
    return now.toTimeString().split(' ')[0]; // HH:MM:SS
  }

  log(level, message, meta = null) {
    const levelInfo = LEVEL_CONFIG[level] || LEVEL_CONFIG[LOG_LEVELS.INFO];
    if (levelInfo.severity > this.currentSeverity) return;

    if (this.isProduction) {
      const payload = {
        time: new Date().toISOString(),
        level,
        msg: message,
        ...(meta && typeof meta === 'object' ? meta : {}),
      };
      console.log(JSON.stringify(payload));
      return;
    }

    const time = `${COLOR_CODES.gray}${this.getTimestamp()}${COLOR_CODES.reset}`;
    const tag = `${levelInfo.color}${COLOR_CODES.bold}[${levelInfo.tag}]${COLOR_CODES.reset}`;
    
    // Clean single line output
    const cleanMsg = typeof message === 'string' ? message.replace(/\s+/g, ' ').trim() : String(message);
    const extra = meta && meta.error ? ` - ${COLOR_CODES.red}${meta.error}${COLOR_CODES.reset}` : '';

    const logFn = level === LOG_LEVELS.ERROR ? console.error : level === LOG_LEVELS.WARN ? console.warn : console.log;
    logFn(`${time} ${tag} ${cleanMsg}${extra}`);
  }

  info(message, meta) {
    this.log(LOG_LEVELS.INFO, message, meta);
  }

  warn(message, meta) {
    this.log(LOG_LEVELS.WARN, message, meta);
  }

  error(message, meta) {
    this.log(LOG_LEVELS.ERROR, message, meta);
  }

  http(message, meta) {
    this.log(LOG_LEVELS.HTTP, message, meta);
  }

  db(message, meta) {
    this.log(LOG_LEVELS.DEBUG, message, meta);
  }

  debug(message, meta) {
    this.log(LOG_LEVELS.DEBUG, message, meta);
  }
}

export const logger = new Logger();
