import { getSupabaseServerAdminClient } from '@kit/supabase/server-admin-client';

import { createAdminDashboardService } from '../services/admin-dashboard.service';

/**
 * @name loadAdminDashboard
 * @description Load the admin dashboard data.
 */
export const loadAdminDashboard = () => {
  const client = getSupabaseServerAdminClient();
  const service = createAdminDashboardService(client);

  return service.getDashboardData();
};
