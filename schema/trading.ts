import { z } from "zod";

export const TradeSchema = z.object({
  stock: z.string().min(1, "Stock name is required"),
  quantity: z.coerce.number().positive("Quantity must be positive"),
  buyPrice: z.coerce.number().positive("Buy price must be positive"),
  sellPrice: z.coerce.number().optional(),
});

export type TradingSchemaType = z.infer<typeof TradeSchema>;
