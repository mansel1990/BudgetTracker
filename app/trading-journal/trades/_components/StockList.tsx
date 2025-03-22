import React from "react";
import { useQuery } from "@tanstack/react-query";
import StockCard from "./StockCard";
import SkeletonWrapper from "@/components/SkeletonWrapper";
import { calculateTradeMetrics } from "@/lib/utils";

const ACCOUNT_ID = localStorage.getItem("accountId");

export type SingleTradeType = {
  trade_id: number;
  company_symbol: string;
  company_name: string;
  shares: number;
  amount: number;
  price: number | null;
  profit_loss: number;
  created_at: string;
  type: string;
};

const fetchTrades = async () => {
  const response = await fetch(`/api/trades/my-stocks`);
  return response.json();
};

const StockList = () => {
  const {
    data: trades,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["trades", ACCOUNT_ID],
    queryFn: () => fetchTrades(),
  });

  if (error)
    return (
      <div className="text-center text-red-500">Failed to load stocks.</div>
    );

  const groupedTrades = trades?.reduce(
    (acc: Record<string, SingleTradeType[]>, trade: SingleTradeType) => {
      if (!acc[trade.company_symbol]) {
        acc[trade.company_symbol] = [];
      }
      acc[trade.company_symbol].push(trade);
      return acc;
    },
    {}
  );

  return (
    <SkeletonWrapper isLoading={isLoading}>
      <div className="my-6">
        <h2 className="text-2xl font-bold mb-4">Holding Stocks</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {groupedTrades &&
            Object.keys(groupedTrades).map((symbol) => {
              const metrics = calculateTradeMetrics(groupedTrades[symbol]);

              return (
                <StockCard
                  key={symbol}
                  stock={{
                    symbol,
                    name: groupedTrades[symbol][0].company_name, // Name from the first trade
                    dateBought: groupedTrades[symbol][0].created_at, // Earliest trade date
                    avgEntryPrice: metrics.avgBuyPrice,
                    totalShares: metrics.netShares,
                    totalAmount:
                      metrics.totalBoughtShares * metrics.avgBuyPrice, // Total cost basis
                    currentPrice: metrics.avgSellPrice || metrics.avgBuyPrice, // If no sell, fallback to buy price
                    profitPercentage: metrics.profitPercentage,
                  }}
                />
              );
            })}
        </div>
      </div>
    </SkeletonWrapper>
  );
};

export default StockList;
