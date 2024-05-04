import { SupabaseClient } from '@supabase/supabase-js';

import { Database } from '@kit/supabase/database';

type Notification = Database['public']['Tables']['notifications'];

export function createNotificationsService(client: SupabaseClient<Database>) {
  return new NotificationsService(client);
}

class NotificationsService {
  constructor(private readonly client: SupabaseClient<Database>) {}

  async createNotification(params: Notification['Insert']) {
    const { error } = await this.client.from('notifications').insert(params);

    if (error) {
      throw error;
    }
  }
}
