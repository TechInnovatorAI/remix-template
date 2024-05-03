import { z } from 'zod';

export const RetrieveCheckoutSessionSchema = z.object({
  sessionId: z.string(),
});
