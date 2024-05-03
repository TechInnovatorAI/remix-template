import type { VerifyOtpParams } from '@supabase/gotrue-js';

import { useMutation } from '@tanstack/react-query';

import { useSupabase } from './use-supabase';

export function useVerifyOtp() {
  const client = useSupabase();

  const mutationKey = ['verify-otp'];

  const mutationFn = async (params: VerifyOtpParams) => {
    const { data, error } = await client.auth.verifyOtp(params);

    if (error) {
      throw error;
    }

    return data;
  };

  return useMutation({
    mutationFn,
    mutationKey,
  });
}
