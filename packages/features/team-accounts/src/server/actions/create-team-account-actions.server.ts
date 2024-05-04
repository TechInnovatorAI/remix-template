import { SupabaseClient } from '@supabase/supabase-js';

import { redirect, redirectDocument } from '@remix-run/react';
import { z } from 'zod';

import { Database } from '@kit/supabase/database';
import { requireUser } from '@kit/supabase/require-user';

import { CreateTeamSchema } from '../../schema/create-team.schema';
import { createCreateTeamAccountService } from '../services/create-team-account.service';

export const createTeamAccountAction = async (params: {
  client: SupabaseClient<Database>;
  data: z.infer<typeof CreateTeamSchema>;
}) => {
  const service = createCreateTeamAccountService(params.client);
  const { name } = CreateTeamSchema.parse(params.data);

  const auth = await requireUser(params.client);

  if (!auth.data) {
    return redirect(auth.redirectTo);
  }

  const { data, error } = await service.createNewOrganizationAccount({
    name,
    userId: auth.data.id,
  });

  if (error) {
    throw new Error('Error creating team account');
  }

  const accountHomePath = '/home/' + data.slug;

  return redirectDocument(accountHomePath);
};
