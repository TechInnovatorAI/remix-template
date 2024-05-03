/**
 * Monitoring service interface
 * @description This service is used to capture exceptions and identify users in the monitoring service
 * @example
 */
export abstract class MonitoringService {
  /**
   * Capture an exception
   * @param error
   * @param extra
   */
  abstract captureException<Extra extends object>(
    error: Error & { digest?: string },
    extra?: Extra,
  ): unknown;

  /**
   * Track an event
   * @param event
   * @param extra
   */
  abstract captureEvent<Extra extends object>(
    event: string,
    extra?: Extra,
  ): unknown;

  /**
   * Identify a user in the monitoring service - used for tracking user actions
   * @param info
   */
  abstract identifyUser<Info extends { id: string }>(info: Info): unknown;
}
