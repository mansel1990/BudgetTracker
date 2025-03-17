import { Trade } from "@/lib/types";
import { useState } from "react";

export function useTrades() {
  const [trades, setTrades] = useState<Trade[]>([]);

  const addTrade = (trade: Omit<Trade, "id" | "date">) => {
    const newTrade = {
      id: Date.now(),
      date: new Date().toISOString(),
      ...trade,
    };

    setTrades([...trades, newTrade]);
  };

  const calculateRealizedPL = () => {
    const positions: Record<string, { shares: number; totalCost: number }> = {};
    let totalPL = 0;

    trades.forEach((trade) => {
      const { symbol, shares, price, type } = trade;
      if (!positions[symbol]) {
        positions[symbol] = { shares: 0, totalCost: 0 };
      }

      if (type === "buy") {
        positions[symbol].totalCost += shares * price;
        positions[symbol].shares += shares;
      } else {
        const avgCost = positions[symbol].totalCost / positions[symbol].shares;
        const pl = shares * (price - avgCost);
        totalPL += pl;

        positions[symbol].shares -= shares;
        positions[symbol].totalCost = avgCost * positions[symbol].shares;
      }
    });

    return totalPL;
  };

  return {
    trades,
    addTrade,
    calculateRealizedPL,
  };
}
