import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { StockType } from "./TradeForm";

type StockProps = {
  stock: {
    symbol: string;
    name: string;
    dateBought: string;
    avgEntryPrice: number;
    totalShares: number;
    totalAmount: number;
    currentPrice: number;
    profitPercentage: number;
  };
};

const StockCard: React.FC<{ stock: StockProps["stock"] }> = ({ stock }) => {
  // Fetch the latest stock market price
  const { data: stocks = [] } = useQuery({
    queryKey: ["stocks"],
  });

  // Get current market price of the stock
  const marketPrice = (stocks as StockType[]).find(
    (s) => s.company_symbol === stock.symbol
  )?.current_market_price;

  // If market price is available, override the displayed current price
  const displayedCurrentPrice = marketPrice ?? stock.currentPrice;

  return (
    <Card className="w-full max-w-sm hover:shadow-lg transition-all duration-200 border border-border bg-background/80 dark:bg-muted/30">
      <CardHeader className="pb-3 border-b border-border">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl font-semibold tracking-wide">
              {stock.name}
            </CardTitle>
            <span className="text-sm text-muted-foreground tracking-wide">
              {stock.symbol}
            </span>
          </div>
          <Badge
            className={cn(
              "px-3 py-1.5 font-semibold text-sm rounded-md",
              stock.profitPercentage >= 0
                ? "bg-green-600/90 text-white hover:bg-green-500"
                : "bg-red-600/90 text-white hover:bg-red-500"
            )}
          >
            {stock.profitPercentage >= 0 ? "+" : ""}
            {stock.profitPercentage.toFixed(2)}
            <span className="text-white/90">%</span>
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-1.5">
              <div className="text-xs font-medium uppercase text-muted-foreground">
                Avg Entry Price
              </div>
              <div className="text-lg font-semibold text-foreground">
                ₹{stock.avgEntryPrice.toFixed(2)}
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="text-xs font-medium uppercase text-muted-foreground">
                Current Price
              </div>
              <div className="text-lg font-semibold text-foreground">
                ₹{Number(displayedCurrentPrice).toFixed(2)}
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="text-xs font-medium uppercase text-muted-foreground">
                Total Shares
              </div>
              <div className="text-lg font-semibold text-foreground">
                {stock.totalShares}
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="text-xs font-medium uppercase text-muted-foreground">
                Total Amount
              </div>
              <div className="text-lg font-semibold text-foreground">
                ₹{stock.totalAmount.toFixed(2)}
              </div>
            </div>
          </div>
          <div className="text-xs text-muted-foreground pt-3 border-t border-border">
            Bought on {new Date(stock.dateBought).toLocaleDateString()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StockCard;
