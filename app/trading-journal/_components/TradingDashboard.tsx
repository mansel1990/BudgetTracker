"use client";

import React from "react";
import TransactionDialog from "./funds/TransactionDialog";
import { Button } from "@/components/ui/button";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  DollarSign,
  LineChart,
  PiggyBank,
  Wallet,
} from "lucide-react";
import StatCard from "./funds/StatCard";
import { useTradingStats } from "@/hooks/use-trading-stats";
import { formatCurrency } from "@/lib/utils";
import SkeletonWrapper from "@/components/SkeletonWrapper";

const TradingDashboard = () => {
  const { data: stats, isLoading } = useTradingStats();
  return (
    <div className="container mx-auto px-6 py-2">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:justify-between">
        <h1 className="text-2xl font-bold sm:text-3xl text-center w-full sm:text-left sm:w-auto">
          Trading Journal
        </h1>
        <div className="flex gap-2 sm:gap-4">
          <TransactionDialog
            type="deposit"
            trigger={
              <Button
                variant="default"
                className="flex-1 bg-emerald-500 px-2 text-sm hover:bg-emerald-600 sm:px-4 sm:text-base"
              >
                Invest
                <br className="sm:hidden" /> Amount
              </Button>
            }
          />
          <TransactionDialog
            type="withdraw"
            trigger={
              <Button
                variant="default"
                className="flex-1 bg-red-500 px-2 text-sm hover:bg-red-600 sm:px-4 sm:text-base"
              >
                Withdraw
                <br className="sm:hidden" /> Amount
              </Button>
            }
          />
        </div>
      </div>

      <SkeletonWrapper isLoading={isLoading}>
        <div className="grid grid-cols-2 gap-2 sm:gap-4 lg:grid-cols-3">
          <StatCard
            title="Amount in Market"
            value={formatCurrency(stats?.amountInMarket ?? 0)}
            description="Current account balance"
            icon={Wallet}
          />
          <StatCard
            title="Total Deposits"
            value={formatCurrency(stats?.totalDeposited ?? 0)}
            description={`${stats?.depositCount ?? 0} deposits`}
            icon={ArrowDownIcon}
            valueColor="text-emerald-500"
          />
          <StatCard
            title="Total Withdrawals"
            value={formatCurrency(stats?.totalWithdrawn ?? 0)}
            description={`${stats?.withdrawalCount ?? 0} withdrawals`}
            icon={ArrowUpIcon}
            valueColor="text-red-500"
          />
          <StatCard
            title="Net Profit/Loss"
            value={formatCurrency(stats?.realizedProfit ?? 0)}
            description={`${(stats?.profitPercentage ?? 0).toFixed(2)}% return`}
            icon={LineChart}
            valueColor={
              (stats?.realizedProfit ?? 0) >= 0
                ? "text-emerald-500"
                : "text-red-500"
            }
          />
          <StatCard
            title="Largest Transaction"
            value={formatCurrency(stats?.largestTransaction ?? 0)}
            description={`${stats?.largestTransactionType} on ${new Date(
              stats?.largestTransactionDate ?? ""
            ).toLocaleDateString()}`}
            icon={DollarSign}
          />
          <StatCard
            title="Investment Journey"
            value={stats?.firstInvestmentDate ?? 0}
            description={`Days since first investment`}
            icon={PiggyBank}
          />
        </div>
      </SkeletonWrapper>
    </div>
  );
};

export default TradingDashboard;
