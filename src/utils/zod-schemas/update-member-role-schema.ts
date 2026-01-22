import { z } from 'zod';

export const updateMemberRoleSchema = z.object({
  role: z.enum(['viewer', 'member', 'admin', 'owner']),
});

export type UpdateMemberRoleInput = z.infer<typeof updateMemberRoleSchema>;
