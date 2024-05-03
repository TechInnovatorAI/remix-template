'use server';

import { SupabaseClient } from '@supabase/supabase-js';

import { redirect } from '@remix-run/react';
import { z } from 'zod';

import { Database } from '@kit/supabase/database';
import { requireUser } from '@kit/supabase/require-user';
import { getSupabaseServerAdminClient } from '@kit/supabase/server-admin-client';

import { LeaveTeamAccountSchema } from '../../schema';
import { createLeaveTeamAccountService } from '../services/leave-team-account.service';

export const leaveTeamAccountAction = async (params: {
  data: z.infer<typeof LeaveTeamAccountSchema>;
  client: SupabaseClient<Database>;
}) => {
  const { payload } = LeaveTeamAccountSchema.parse(params.data);

  const auth = await requireUser(params.client);

  if (!auth.data) {
    return redirect(auth.redirectTo);
  }

  const service = createLeaveTeamAccountService(getSupabaseServerAdminClient());

  await service.leaveTeamAccount({
    accountId: payload.accountId,
    userId: auth.data.id,
  });

  return redirect('/home');
};
