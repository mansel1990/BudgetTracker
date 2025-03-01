import { z } from "zod";

export const CreateTransactionSchema = z.object({
  amount: z.number().positive(),
  description: z.string().optional(),
  date: z.preprocess((val) => {
    if (val instanceof Date) {
      return new Date(
        Date.UTC(val.getFullYear(), val.getMonth(), val.getDate())
      );
    }
    return val;
  }, z.date()),
  category: z.string(),
  type: z.union([z.literal("income"), z.literal("expense")]),
});

export type CreateTransactionSchemaType = z.infer<
  typeof CreateTransactionSchema
>;
