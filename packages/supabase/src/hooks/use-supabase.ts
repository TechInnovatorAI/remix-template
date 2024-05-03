import { useMemo } from 'react';

import { getSupabaseBrowserClient } from '../clients/browser-client';

export function useSupabase() {
  return useMemo(() => getSupabaseBrowserClient(), []);
}
