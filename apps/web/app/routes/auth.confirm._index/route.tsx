import { type EmailOtpType } from '@supabase/supabase-js';

import { redirect } from '@remix-run/react';
import type { LoaderFunctionArgs } from '@remix-run/server-runtime';

import { getSupabaseServerClient } from '@kit/supabase/server-client';

import pathsConfig from '~/config/paths.config';

const defaultNextUrl = pathsConfig.app.home;

export async function loader({ request }: LoaderFunctionArgs) {
  const { searchParams } = new URL(request.url);

  const token_hash = searchParams.get('token_hash');
  const type = searchParams.get('type') as EmailOtpType | null;
  const next = searchParams.get('next') ?? defaultNextUrl;
  const callbackParam = searchParams.get('callback');
  const callbackUrl = callbackParam ? new URL(callbackParam) : null;
  const inviteToken = callbackUrl?.searchParams.get('invite_token');

  let pathname = next;
  const nextSearchParams = new URLSearchParams();

  // if we have an invite token, we append it to the redirect url
  if (inviteToken) {
    // if we have an invite token, we redirect to the join team page
    // instead of the default next url. This is because the user is trying
    // to join a team and we want to make sure they are redirected to the
    // correct page.
    pathname = pathsConfig.app.joinTeam;
    nextSearchParams.set('invite_token', inviteToken);
  }

  if (token_hash && type) {
    const supabase = getSupabaseServerClient(request);

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });

    // if no error - proceed to the next page
    if (!error) {
      return redirect(pathname + '?' + nextSearchParams.toString(), {
        headers: request.headers,
      });
    }
  }

  // return the user to an error page with some instructions
  pathname = '/auth/callback/error';

  return redirect(pathname + '?' + nextSearchParams.toString());
}
