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

const TradingDashboard = () => {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-8 flex justify-between">
        <h1 className="text-3xl font-bold">Trading Journal</h1>
        <div className="flex gap-4">
          <TransactionDialog
            type="deposit"
            trigger={
              <Button
                variant="default"
                className="bg-emerald-500 hover:bg-emerald-600"
              >
                Deposit
              </Button>
            }
          />
          <TransactionDialog
            type="withdraw"
            trigger={
              <Button variant="default" className="bg-red-500 hover:bg-red-600">
                Withdraw
              </Button>
            }
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Amount in Market"
          value="$2,000.00"
          description="Current account balance"
          icon={Wallet}
        />
        <StatCard
          title="Total Deposits"
          value="$5,000.00"
          description="12 deposits"
          icon={ArrowDownIcon}
          valueColor="text-emerald-500"
        />
        <StatCard
          title="Total Withdrawals"
          value="$3,000.00"
          description="8 withdrawals"
          icon={ArrowUpIcon}
          valueColor="text-red-500"
        />
        <StatCard
          title="Net Profit/Loss"
          value="+$500.00"
          description="+25% from initial deposit"
          icon={LineChart}
          valueColor="text-emerald-500"
        />
        <StatCard
          title="Largest Transaction"
          value="$1,000.00"
          description="Deposit on Dec 1, 2023"
          icon={DollarSign}
        />
        <StatCard
          title="Monthly Flow"
          value="+$200.00"
          description="Net flow this month"
          icon={PiggyBank}
          valueColor="text-emerald-500"
        />
      </div>
    </div>
  );
};

export default TradingDashboard;
