import { SingleTradeType } from "@/app/trading-journal/trades/_components/StockList";
import { Trade } from "@prisma/client";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
};

export function calculateTradeMetrics(trades: SingleTradeType[]) {
  let totalBoughtShares = 0;
  let totalBuyCost = 0;
  let totalSoldShares = 0;
  let totalSellProceeds = 0;

  trades.forEach((trade) => {
    const shares = Number(trade.shares);
    const price = Number(trade.price);
    const amount = Number(trade.amount);

    if (trade.type === "buy") {
      totalBoughtShares += shares;
      totalBuyCost += amount; // Total cost of all buy trades
    } else if (trade.type === "sell") {
      totalSoldShares += shares;
      totalSellProceeds += amount; // Total proceeds from sell trades
    }
  });

  const avgBuyPrice =
    totalBoughtShares > 0 ? totalBuyCost / totalBoughtShares : 0;
  const avgSellPrice =
    totalSoldShares > 0 ? totalSellProceeds / totalSoldShares : 0;

  // Net shares held after selling
  const netShares = totalBoughtShares - totalSoldShares;

  // Cost basis of shares sold
  const costBasisForSold = totalSoldShares * avgBuyPrice;

  // Profit from sold shares
  const profit = totalSellProceeds - costBasisForSold;

  // Profit percentage based on sell trades
  const profitPercentage =
    costBasisForSold > 0 ? (profit / costBasisForSold) * 100 : 0;

  return {
    avgBuyPrice,
    avgSellPrice,
    totalBoughtShares,
    totalSoldShares,
    netShares, // Remaining shares
    totalAmount: netShares * avgBuyPrice, // Total cost basis for remaining shares
    profitPercentage,
  };
}
