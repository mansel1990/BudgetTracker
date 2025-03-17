import React from "react";
import TradingDashboard from "./_components/TradingDashboard";
import TradingWaterfall from "./_components/funds/TradingWaterfall";
import InvestmentTimeline from "./_components/funds/InvestmentTimeline";

const page = () => {
  return (
    <main className="container mx-auto px-2 sm:px-6 py-4">
      <TradingDashboard />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mx-6 my-4">
        <TradingWaterfall />
        <InvestmentTimeline />
      </div>
    </main>
  );
};

export default page;
