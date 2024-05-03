import { z } from 'zod';

const confirmationString = 'TRANSFER';

export const TransferOwnershipConfirmationSchema = z.object({
  intent: z.literal('transfer-ownership'),
  payload: z.object({
    userId: z.string().uuid(),
    confirmation: z.custom((value) => value === confirmationString),
    accountId: z.string().uuid(),
  })
});
