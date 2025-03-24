"use client";

import React, { useMemo } from "react";
import { useTradingStats } from "@/hooks/use-trading-stats";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Area,
  ComposedChart,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FundTransaction } from "@prisma/client";

type ChartDataPoint = {
  date: string;
  deposits: number;
  withdrawals: number;
  marketValue: number;
  profitShade: number;
  lossShade: number;
};

const InvestmentTimeline = () => {
  const { data: stats } = useTradingStats();

  // Ensure hooks are always called before returning JSX
  const chartData = useMemo(() => {
    if (!stats?.transactionHistory) return [];
    return generateChartData(stats.transactionHistory);
  }, [stats?.transactionHistory]);

  if (!stats || !stats.transactionHistory) {
    return <div>Loading...</div>;
  }

  return (
    <Card className="mt-2">
      <CardHeader className="pb-2 px-4">
        <CardTitle className="text-lg">Investment Timeline</CardTitle>
        <CardDescription className="text-sm">
          Green: Profit | Red: Loss
        </CardDescription>
      </CardHeader>
      <CardContent className="px-4">
        <ResponsiveContainer width="100%" height={250}>
          <ComposedChart
            data={chartData}
            margin={{ top: 10, right: 30, left: 10, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="profitShade"
              stroke="green"
              fill="rgba(16, 185, 129, 0.5)"
            />
            <Area
              type="monotone"
              dataKey="lossShade"
              stroke="red"
              fill="rgba(239, 68, 68, 0.5)"
            />
            <Line
              type="monotone"
              dataKey="deposits"
              stroke="#3b82f6"
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="withdrawals"
              stroke="#ea580c"
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="marketValue"
              stroke="#aecdfb"
              strokeWidth={2}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

const generateChartData = (transactions: any[]): ChartDataPoint[] => {
  return transactions.map((t, index) => {
    // Use cumulative deposits directly
    const newDeposits = t.deposits ?? 0;
    const newWithdrawals = t.withdrawals ?? 0;
    const marketValue = t.marketValue ?? 0;

    const totalMoneyRotated = t.deposits - t.withdrawals;

    // Calculate profit/loss shading correctly
    const profitShade =
      marketValue - totalMoneyRotated > 0 ? marketValue - totalMoneyRotated : 0;
    const lossShade =
      marketValue - totalMoneyRotated < 0 ? totalMoneyRotated - marketValue : 0;

    // Format date
    const parsedDate = new Date(t.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    return {
      date: isNaN(new Date(t.date).getTime()) ? "Invalid Date" : parsedDate,
      deposits: newDeposits,
      withdrawals: newWithdrawals,
      marketValue,
      profitShade,
      lossShade,
    };
  });
};

export default InvestmentTimeline;
