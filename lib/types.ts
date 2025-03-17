export type TransactionType = "income" | "expense";
export type Timeframe = "month" | "year";
export type Period = { year: number; month: number };

export interface FundTransaction {
  id: number;
  amount: number;
  type: "deposit" | "withdraw";
  date: string;
}

export interface Trade {
  id: number;
  symbol: string;
  shares: number;
  price: number;
  amount: number;
  type: "buy" | "sell";
  date: string;
}
