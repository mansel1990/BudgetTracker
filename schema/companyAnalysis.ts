import { z } from "zod";

export const CompanyPeerSchema = z.object({
  company_name: z.string(),
  company_screener: z.string().url(),
});

export const CompanyAnalysisSchema = z.object({
  company_name: z.string(),
  current_market_price: z.number(),
  company_screener: z.string().url(),
  median_pe: z.number(),
  pe: z.number(),
  company_symbol: z.string(),
  company_peers: z.array(CompanyPeerSchema), // ✅ Changed from string to array
  sector: z.string(),
  industry: z.string(),
  pe_score: z.number(),
  peg_score: z.number(),
  peg_ranking: z.number(),
  de_score: z.number(),
  de_ranking: z.number(),
  piotroski: z.number(),
  piotroski_rank: z.number(),
  piotroski_score: z.number(),
  daily_filter_score: z.number(),
  sales_growth: z.array(z.number()), // ✅ Changed from string to array
  sales_rank: z.array(z.number()), // ✅ Changed from string to array
  sales_score: z.number(),
  sales_filter_score: z.number(),
  profit_growth: z.array(z.number()), // ✅ Changed from string to array
  profit_rank: z.array(z.number()), // ✅ Changed from string to array
  profit_score: z.number(),
  profit_filter_score: z.number(),
  roe_10y: z.number(),
  roe_5y: z.number(),
  roe_3y: z.number(),
  roe_1y: z.number(),
  roe_rank_10y: z.number(),
  roe_rank_5y: z.number(),
  roe_rank_3y: z.number(),
  roe_rank_1y: z.number(),
  score: z.number(),
  filter_count: z.number(),
  total_ranks: z.number(),
  last_updated: z.coerce.date(), // ✅ Converts string to Date
  Total_Filter_Score: z.number(),
  sum_score: z.number(),
  final_score: z.number(),
  target_price: z.number().nullable(),
  Indicator: z.string(), // ✅ Fixed enum type
  SellPrice: z.number().nullable(), // ✅ Fixed nullable type
});

export type CompanyAnalysisType = z.infer<typeof CompanyAnalysisSchema>;
