

import { cache } from 'react';

import { getSupabaseServerComponentClient } from '@kit/supabase/server-component-client';

import { createAdminDashboardService } from '../services/admin-dashboard.service';

/**
 * @name loadAdminDashboard
 * @description Load the admin dashboard data.
 * @param params
 */
export const loadAdminDashboard = cache(() => {
  const client = getSupabaseServerComponentClient({ admin: true });
  const service = createAdminDashboardService(client);

  return service.getDashboardData();
});
