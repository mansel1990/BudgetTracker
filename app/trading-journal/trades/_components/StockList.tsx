import React from "react";
import { useQuery } from "@tanstack/react-query";
import StockCard from "./StockCard";
import SoldStockCard from "./SoldStockCard";
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

  const activeStocks: any[] = [];
  const soldStocks: any[] = [];

  Object.keys(groupedTrades || {}).forEach((symbol) => {
    const tradesList = groupedTrades[symbol];
    const metrics = calculateTradeMetrics(tradesList);

    if (metrics.netShares > 0) {
      activeStocks.push({
        symbol,
        name: tradesList[0].company_name,
        dateBought: tradesList[0].created_at,
        avgEntryPrice: metrics.avgBuyPrice,
        totalShares: metrics.netShares,
        totalAmount: metrics.totalBoughtShares * metrics.avgBuyPrice,
        currentPrice: metrics.avgSellPrice || metrics.avgBuyPrice,
        profitPercentage: metrics.profitPercentage,
      });
    } else {
      // Calculate amount bought and sold
      const amountBought = metrics.totalBoughtShares * metrics.avgBuyPrice;
      const amountSold = metrics.totalSoldShares * metrics.avgSellPrice;
      const totalProfitLoss = amountSold - amountBought;

      soldStocks.push({
        symbol,
        name: tradesList[0].company_name,
        lastSoldDate: tradesList[tradesList.length - 1].created_at, // Latest sell date
        amountBought,
        amountSold,
        totalProfitLoss, // Now calculated manually
      });
    }
  });

  return (
    <SkeletonWrapper isLoading={isLoading}>
      <div className="my-6">
        {/* Active Stocks */}
        <h2 className="text-2xl font-bold mb-4">Holding Stocks</h2>
        {activeStocks.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {activeStocks.map((stock) => (
              <StockCard key={stock.symbol} stock={stock} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No active holdings.</p>
        )}

        {/* Sold Stocks */}
        {soldStocks.length > 0 && (
          <>
            <h2 className="text-2xl font-bold mt-8 mb-4">Sold Stocks</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 opacity-90">
              {soldStocks.map((stock) => (
                <SoldStockCard key={stock.symbol} {...stock} />
              ))}
            </div>
          </>
        )}
      </div>
    </SkeletonWrapper>
  );
};

export default StockList;
