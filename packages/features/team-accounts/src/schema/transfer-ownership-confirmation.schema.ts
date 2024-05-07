import { z } from 'zod';

import { CsrfTokenSchema } from '@kit/csrf/schema';

const confirmationString = 'TRANSFER';

export const TransferOwnershipConfirmationSchema = CsrfTokenSchema.extend({
  userId: z.string().uuid(),
  confirmation: z.custom((value) => value === confirmationString),
  accountId: z.string().uuid(),
});

export const TransferOwnershipSchema = z.object({
  intent: z.literal('transfer-ownership'),
  payload: TransferOwnershipConfirmationSchema,
});
