import { z } from 'zod';

export const AccountDetailsSchema = z.object({
  displayName: z.string().min(2).max(100),
});
