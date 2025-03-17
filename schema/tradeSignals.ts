import { z } from "zod";

// Request Access Schema
export const RequestTradeSignalSchema = z.object({
  userId: z.string(),
});

export type RequestTradeSignalType = z.infer<typeof RequestTradeSignalSchema>;

// Approve Access Schema
export const ApproveTradeSignalSchema = z.object({
  targetUserId: z.number(),
  days: z.number().positive(),
});

export type ApproveTradeSignalType = z.infer<typeof ApproveTradeSignalSchema>;

// Revoke Access Schema
export const RevokeTradeSignalSchema = z.object({
  targetUserId: z.string(),
});

export type RevokeTradeSignalType = z.infer<typeof RevokeTradeSignalSchema>;
