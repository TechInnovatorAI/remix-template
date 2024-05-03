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
      const { Logger: PinoLogger } = await import('./impl/pino');

      return PinoLogger;
    }

    default:
      throw new Error(`Unknown logger: ${process.env.LOGGER}`);
  }
}

export { getLogger };
