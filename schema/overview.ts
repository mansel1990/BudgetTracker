import { MAX_DATE_RANGE_DAYS } from "@/lib/constants";
import { differenceInDays } from "date-fns";
import { z } from "zod";

export const OverviewQuerySchema = z
  .object({
    from: z.date(),
    to: z.date(),
  })
  .refine((args) => {
    const { from, to } = args;
    const days = differenceInDays(to, from);
    const isValidRange = days >= 0 && days <= MAX_DATE_RANGE_DAYS;

    return isValidRange;
  });
