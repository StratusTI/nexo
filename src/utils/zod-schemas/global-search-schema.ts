import { z } from 'zod'

export const globalSearchSchema = z.object({
  q: z
    .string({
      error: () => ({ message: 'Search query is required' }),
    })
    .min(2, 'Query must be at least 2 characters')
    .max(100, 'Query must be at most 100 characters'),

  types: z
    .array(z.enum(['project', 'sprint', 'task', 'document']))
    .optional(),

  limit: z
    .string()
    .transform((val) => Number.parseInt(val, 10))
    .pipe(z.number().min(1).max(50))
    .optional()
})

export type GlobalSearchInput = z.infer<typeof globalSearchSchema>
