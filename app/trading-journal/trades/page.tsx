"use client";

import StockList from "./_components/StockList";
import TradeForm from "./_components/TradeForm";

export default function TradesPage() {
  return (
    <div className="container mx-auto p-6">
      <TradeForm />
      <StockList />
    </div>
  );
}
