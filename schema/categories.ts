import { z } from "zod";

export const CreateCategoryScehma = z.object({
  name: z.string(),
  icon: z.string().max(20),
  type: z.enum(["expense", "income"]),
});

export type CreateCategoryScehmaType = z.infer<typeof CreateCategoryScehma>;
