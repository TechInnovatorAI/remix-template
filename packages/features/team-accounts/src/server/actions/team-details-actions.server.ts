import type { SupabaseClient } from '@supabase/supabase-js';

import { redirect } from '@remix-run/react';
import { z } from 'zod';

import { Database } from '@kit/supabase/database';

import { UpdateTeamNameSchema } from '../../schema';

export const updateTeamAccountName = async (params: {
  client: SupabaseClient<Database>;
  data: z.infer<typeof UpdateTeamNameSchema>;
}) => {
  const { payload } = UpdateTeamNameSchema.parse(params.data);
  const { name, slug, path } = payload;

  const { error, data } = await params.client
    .from('accounts')
    .update({
      name,
      slug,
    })
    .match({
      slug,
    })
    .select('slug')
    .single();

  if (error) {
    return {
      success: false,
    };
  }

  const newSlug = data.slug;

  if (newSlug) {
    const nextPath = path.replace('[account]', newSlug);

    return redirect(nextPath);
  }

  return { success: true };
};
