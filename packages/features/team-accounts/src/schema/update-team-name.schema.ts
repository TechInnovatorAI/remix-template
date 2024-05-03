import { z } from 'zod';

export const TeamNameFormSchema = z.object({
  name: z.string().min(1).max(255),
});

export const UpdateTeamNameSchema = TeamNameFormSchema.merge(
  z.object({
    intent: z.literal('update-team-name'),
    payload: z.object({
      slug: z.string().min(1).max(255),
      path: z.string().min(1).max(255),
      name: z.string().min(1).max(255),
    }),
  }),
);
