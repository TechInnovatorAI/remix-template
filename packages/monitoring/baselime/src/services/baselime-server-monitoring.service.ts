import { z } from 'zod';

import { MonitoringService } from '@kit/monitoring-core';

const apiKey = z
  .string({
    required_error: 'VITE_BASELIME_KEY is required',
  })
  .parse(import.meta.env.VITE_BASELIME_KEY);

export class BaselimeServerMonitoringService implements MonitoringService {
  userId: string | null = null;

  async captureException(
    error: Error | null,
    extra?: {
      requestId?: string;
      sessionId?: string;
      namespace?: string;
      service?: string;
    },
  ) {
    const formattedError = error ? getFormattedError(error) : {};

    const event = {
      level: 'error',
      data: { error },
      error: {
        ...formattedError,
      },
      message: error ? `${error.name}: ${error.message}` : `Unknown error`,
    };

    const response = await fetch(`https://events.baselime.io/v1/logs`, {
      method: 'POST',
      headers: {
        contentType: 'application/json',
        'x-api-key': apiKey,
        'x-service': extra?.service ?? '',
        'x-namespace': extra?.namespace ?? '',
      },
      body: JSON.stringify([
        {
          userId: this.userId,
          sessionId: extra?.sessionId,
          namespace: extra?.namespace,
          ...event,
        },
      ]),
    });

    if (!response.ok) {
      console.error(
        {
          response,
          event,
        },
        'Failed to send event to Baselime',
      );
    }
  }

  async captureEvent<
    Extra extends {
      sessionId?: string;
      namespace?: string;
      service?: string;
    },
  >(event: string, extra?: Extra) {
    const response = await fetch(`https://events.baselime.io/v1/logs`, {
      method: 'POST',
      headers: {
        contentType: 'application/json',
        'x-api-key': apiKey,
        'x-service': extra?.service ?? '',
        'x-namespace': extra?.namespace ?? '',
      },
      body: JSON.stringify([
        {
          userId: this.userId,
          sessionId: extra?.sessionId,
          namespace: extra?.namespace,
          message: event,
        },
      ]),
    });

    if (!response.ok) {
      console.error(
        {
          response,
          event,
        },
        'Failed to send event to Baselime',
      );
    }
  }

  identifyUser<Info extends { id: string }>(info: Info) {
    this.userId = info.id;
  }

  ready() {
    return Promise.resolve();
  }
}

function getFormattedError(error: Error) {
  return {
    name: error.name,
    message: error.message,
    stack: error.stack,
  };
}
