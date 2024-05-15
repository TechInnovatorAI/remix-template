import process from 'node:process';

import { Logger as LoggerInstance } from './logger';

const LOGGER = process.env.LOGGER ?? 'pino';

/*
 * Logger
 * By default, the logger is set to use Pino. To change the logger, update the import statement below.
 * to your desired logger implementation.
 */
async function getLogger(): Promise<LoggerInstance> {
  switch (LOGGER) {
    case 'pino': {
      const { getPinoLogger } = await import('./impl/pino');

      return getPinoLogger();
    }

    case 'console': {
      const { Logger: ConsoleLogger } = await import('./impl/console');

      return ConsoleLogger;
    }

    default:
      throw new Error(`Unknown logger: ${LOGGER}`);
  }
}

export { getLogger };
