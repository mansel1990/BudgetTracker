"use server";

import { prisma } from "@/lib/prisma";

interface CreateTradeParams {
  accountId: number;
  symbol: string;
  shares: number;
  price: number;
  type: "buy" | "sell";
}

export async function getTrades(accountId: number) {
  try {
    const trades = await prisma.trade.findMany({
      where: { account_id: accountId },
      orderBy: { created_at: "desc" },
    });
    return { success: true, data: trades };
  } catch (error) {
    console.error("Error fetching trades:", error);
    return { success: false, error: "Failed to fetch trades" };
  }
}

export async function calculateRealizedPL(accountId: number) {
  try {
    const trades = await prisma.trade.findMany({
      where: { account_id: accountId },
      orderBy: { created_at: "asc" },
    });

    const positions: Record<string, { shares: number; totalCost: number }> = {};
    let realizedPL = 0;

    trades.forEach((trade) => {
      const { company_name: symbol, shares, price, type } = trade;
      if (!positions[symbol]) {
        positions[symbol] = { shares: 0, totalCost: 0 };
      }

      const sharesNum = Number(shares);
      const priceNum = Number(price);

      if (type === "buy") {
        positions[symbol].totalCost += sharesNum * priceNum;
        positions[symbol].shares += sharesNum;
      } else {
        const avgCost = positions[symbol].totalCost / positions[symbol].shares;
        const pl = sharesNum * (priceNum - avgCost);
        realizedPL += pl;

        positions[symbol].shares -= sharesNum;
        positions[symbol].totalCost = avgCost * positions[symbol].shares;
      }
    });

    return { success: true, data: realizedPL };
  } catch (error) {
    console.error("Error calculating P/L:", error);
    return { success: false, error: "Failed to calculate P/L" };
  }
}
