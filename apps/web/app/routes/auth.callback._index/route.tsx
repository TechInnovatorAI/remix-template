import { redirect } from '@remix-run/react';
import type { LoaderFunctionArgs } from '@remix-run/server-runtime';

import { createAuthCallbackService } from '@kit/supabase/auth';
import { getSupabaseServerClient } from '@kit/supabase/server-client';

import pathsConfig from '~/config/paths.config';

export async function loader({ request }: LoaderFunctionArgs) {
  const service = createAuthCallbackService(getSupabaseServerClient(request));

  const { nextPath } = await service.exchangeCodeForSession(request, {
    joinTeamPath: pathsConfig.app.joinTeam,
    redirectPath: pathsConfig.app.home,
  });

  return redirect(nextPath, {
    headers: request.headers,
  });
}
