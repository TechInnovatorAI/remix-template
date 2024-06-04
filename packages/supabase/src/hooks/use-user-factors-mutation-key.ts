export function useFactorsMutationKey(userId: string) {
  return ['mfa-factors', userId];
}
