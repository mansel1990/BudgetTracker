"use client";

import React from "react";
import { useTradingStats } from "@/hooks/use-trading-stats";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const TradingWaterfall = () => {
  const { data: stats } = useTradingStats();

  const chartData = [
    { name: "Deposits", value: stats?.totalDeposited ?? 0, color: "#16a34a" }, // Green
    {
      name: "Withdrawals",
      value: -(stats?.totalWithdrawn ?? 0),
      color: "#dc2626",
    }, // Red
    {
      name: "Profit/Loss",
      value: stats?.realizedProfit ?? 0,
      color: "#3b82f6",
    }, // Blue
    {
      name: "Current Balance",
      value: stats?.amountInMarket ?? 0,
      color: "#9333ea",
    }, // Purple
  ];

  return (
    <Card className="mt-2">
      <CardHeader className="pb-2 px-4">
        <CardTitle className="text-lg">Trading Flow</CardTitle>
        <CardDescription className="text-sm">
          Visualizing your deposits, withdrawals & balance.
        </CardDescription>
      </CardHeader>
      <CardContent className="px-4">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={chartData}
            layout="vertical" // Vertical bars so labels are visible
            margin={{ top: 10, right: 30, left: 50, bottom: 5 }}
          >
            <XAxis type="number" />
            <YAxis dataKey="name" type="category" width={100} />
            <Tooltip />
            <Bar dataKey="value">
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default TradingWaterfall;
