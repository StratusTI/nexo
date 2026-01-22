import { z } from 'zod';

export const addMemberSchema = z.object({
  userId: z.number({
    error: 'User ID must be a number',
  }).int().positive('User ID must be a positive integer'),

  role: z.enum(['viewer', 'member', 'admin', 'owner']),
});

export type AddMemberInput = z.infer<typeof addMemberSchema>;
