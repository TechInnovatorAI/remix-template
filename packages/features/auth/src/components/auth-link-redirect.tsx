'use client';

import { useEffect } from 'react';

import { useNavigate, useSearchParams } from '@remix-run/react';

import { useSupabase } from '@kit/supabase/hooks/use-supabase';

function AuthLinkRedirect(props: { redirectPath?: string }) {
  const [params] = useSearchParams();

  const redirectPath = params?.get('redirectPath') ?? props.redirectPath ?? '/';

  useRedirectOnSignIn(redirectPath);

  return null;
}

export default AuthLinkRedirect;

function useRedirectOnSignIn(redirectPath: string) {
  const supabase = useSupabase();
  const navigate = useNavigate();

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((_, session) => {
      if (session) {
        navigate(redirectPath);
      }
    });

    return () => data.subscription.unsubscribe();
  }, [supabase, navigate, redirectPath]);
}
