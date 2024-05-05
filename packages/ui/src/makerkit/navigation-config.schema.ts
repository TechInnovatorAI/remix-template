import { z } from 'zod';

export const NavigationConfigSchema = z.object({
  style: z.enum(['custom', 'sidebar', 'header']).default('sidebar'),
  routes: z.array(
    z.union([
      z.object({
        label: z.string(),
        path: z.string(),
        Icon: z.custom<React.ReactNode>(),
        end: z.boolean().optional(),
      }),
      z.object({
        label: z.string(),
        collapsible: z.boolean().optional(),
        collapsed: z.boolean().optional(),
        children: z.array(
          z.object({
            label: z.string(),
            path: z.string(),
            Icon: z.custom<React.ReactNode>(),
            end: z.boolean().optional(),
          }),
        ),
      }),
      z.object({
        divider: z.literal(true),
      }),
    ]),
  ),
});
