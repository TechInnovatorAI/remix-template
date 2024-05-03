import { pino } from 'pino';

/**
 * @name Logger
 * @description A logger implementation using Pino
 */
const Logger = pino({
  browser: {
    asObject: true,
  },
  level: 'debug',
  base: {
    env: process.env.NODE_ENV,
  },
  errorKey: 'error',
});

export { Logger };
