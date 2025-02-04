import { z } from "zod";

export const RemoveMemberSchema = z.object({
  userId: z.string(),
});

export type RemoveMemberSchemaType = z.infer<typeof RemoveMemberSchema>;
