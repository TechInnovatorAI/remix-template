import { useUserSession } from './use-user-session';

export function useFactorsMutationKey() {
  const user = useUserSession();
  const userId = user?.data?.user.id;

  return ['mfa-factors', userId];
}
