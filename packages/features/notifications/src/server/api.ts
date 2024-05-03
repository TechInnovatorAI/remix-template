/**
 * @file API for notifications
 *
 * Usage
 *
 * ```typescript
 * import { createNotificationsApi } from '@kit/notifications/api';
 *
 * const api = createNotificationsApi(client);
 *
 * await api.createNotification({
 *  body: 'Hello, world!',
 *  account_id: '123',
 *  type: 'info',
 * });
 * ```
 *
 */
import { SupabaseClient } from '@supabase/supabase-js';

import { Database } from '@kit/supabase/database';

import { createNotificationsService } from './notifications.service';

type Notification = Database['public']['Tables']['notifications'];

/**
 * @name createNotificationsApi
 * @param client
 */
export function createNotificationsApi(client: SupabaseClient<Database>) {
  return new NotificationsApi(client);
}

/**
 * @name NotificationsApi
 */
class NotificationsApi {
  private readonly service: ReturnType<typeof createNotificationsService>;

  constructor(private readonly client: SupabaseClient<Database>) {
    this.service = createNotificationsService(client);
  }

  /**
   * @name createNotification
   * @description Create a new notification in the database
   * @param params
   */
  createNotification(params: Notification['Insert']) {
    return this.service.createNotification(params);
  }
}
