import { z } from "zod";

export const emailResponseSchema = z.object({
  amount: z.number(),
  description: z.string(),
  category: z.string(),
  transactionDate: z.string(),
});

export type EmailResponseSchemaType = z.infer<typeof emailResponseSchema>;
