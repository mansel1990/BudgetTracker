"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { CompanyAnalysisType } from "@/schema/companyAnalysis";
import { useParams, useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useState } from "react";

const CompanyDetails = () => {
  const { company_symbol } = useParams();
  const queryClient = useQueryClient();
  const [showAllPeers, setShowAllPeers] = useState(false);
  const router = useRouter();

  const companyAnalysisData = queryClient.getQueryData(["companyAnalysis"]) as
    | CompanyAnalysisType[]
    | undefined;
  const data = companyAnalysisData?.find(
    (company) => company.company_symbol === company_symbol
  );
  const peers = Array.isArray(data?.company_peers) ? data.company_peers : [];

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <p className="text-muted-foreground">No data available</p>
        <Button
          variant="outline"
          onClick={() => router.push("/trading-journal/signals")}
        >
          Back to Signals
        </Button>
      </div>
    );
  }

  const salesData = JSON.parse(
    typeof data.sales_growth === "string" ? data.sales_growth : "[]"
  ).map((value: number, index: number) => ({ year: index + 1, value }));
  const profitData = JSON.parse(
    typeof data.profit_growth === "string" ? data.profit_growth : "[]"
  ).map((value: number, index: number) => ({ year: index + 1, value }));

  return (
    <div className="p-6 space-y-6">
      <Button
        variant="outline"
        size="sm"
        onClick={() => router.push("/trading-journal/signals")}
        className="mb-2"
      >
        ← Back to Signals
      </Button>
      {/* Company Info */}
      <Card className="p-4 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">{data.company_name}</h2>
          <p className="text-muted-foreground">
            {data.sector} - {data.industry}
          </p>
        </div>
        <Link href={data.company_screener} target="_blank">
          <Button variant="outline">View on Screener</Button>
        </Link>
      </Card>

      {/* Valuation */}
      <Card className="p-4 space-y-3">
        <h3 className="text-lg font-semibold">Valuation</h3>
        <Separator />
        <p>
          PE: {data.pe} (Median: {data.median_pe})
        </p>
        <p>
          PEG Score: {data.peg_score} (Rank: {data.peg_ranking})
        </p>
        <p>
          Debt-Equity Score: {data.de_score} (Rank: {data.de_ranking})
        </p>
      </Card>

      {/* Filter scores */}
      <Card className="p-6">
        <h3 className="text-xl font-bold mb-6">Filter Scores Analysis</h3>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Valuation Metrics */}
          <div className="space-y-4">
            <h4 className="font-semibold text-sm text-muted-foreground mb-4">
              Valuation Metrics
            </h4>
            {[
              { label: "PE Score", value: data.pe_score, color: "bg-blue-500" },
              {
                label: "PEG Score",
                value: data.peg_score,
                color: "bg-green-500",
              },
              {
                label: "DE Score",
                value: data.de_score,
                color: "bg-purple-500",
              },
            ].map((item) => (
              <div key={item.label} className="bg-muted/30 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">{item.label}</span>
                  <span className="font-bold">
                    {Number(item.value || 0).toFixed(2)}
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-1.5">
                  <div
                    className={`${item.color} h-1.5 rounded-full transition-all duration-500`}
                    style={{ width: `${Number(item.value || 0) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Growth Metrics */}
          <div className="space-y-4">
            <h4 className="font-semibold text-sm text-muted-foreground mb-4">
              Growth Metrics
            </h4>
            {[
              {
                label: "Sales Score",
                value: data.sales_score,
                color: "bg-teal-500",
              },
              {
                label: "Profit Score",
                value: data.profit_score,
                color: "bg-pink-500",
              },
              { label: "ROE Score", value: data.score, color: "bg-indigo-500" },
            ].map((item) => (
              <div key={item.label} className="bg-muted/30 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">{item.label}</span>
                  <span className="font-bold">
                    {Number(item.value || 0).toFixed(2)}
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-1.5">
                  <div
                    className={`${item.color} h-1.5 rounded-full transition-all duration-500`}
                    style={{ width: `${Number(item.value || 0) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Quality Metrics */}
          <div className="space-y-4">
            <h4 className="font-semibold text-sm text-muted-foreground mb-4">
              Quality Metrics
            </h4>
            <div className="bg-muted/30 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Piotroski Score</span>
                <span className="font-bold">
                  {Number(data.piotroski_score || 0).toFixed(2)}
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-1.5">
                <div
                  className="bg-orange-500 h-1.5 rounded-full transition-all duration-500"
                  style={{
                    width: `${Number(data.piotroski_score || 0) * 100}%`,
                  }}
                />
              </div>
            </div>

            {/* Total Score Card */}
            <div className="bg-gradient-to-br from-green-500/10 to-blue-500/10 p-6 rounded-xl mt-8">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h4 className="font-bold text-lg">Total Filter Score</h4>
                  <p className="text-sm text-muted-foreground">
                    Overall Performance
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold text-green-600">
                    {Number(data.Total_Filter_Score || 0).toFixed(1)}
                  </span>
                  <span className="text-sm text-muted-foreground ml-1">
                    /36
                  </span>
                </div>
              </div>
              <div className="w-full bg-muted/50 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                  style={{
                    width: `${
                      (Number(data.Total_Filter_Score || 0) / 36) * 100
                    }%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-4">Sales Growth</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart
              data={salesData}
              margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
            >
              <XAxis dataKey="year" stroke="#888888" fontSize={12} />
              <YAxis stroke="#888888" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "none",
                  borderRadius: "8px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }}
                cursor={{
                  stroke: "#4f46e5",
                  strokeWidth: 1,
                  strokeDasharray: "4",
                }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#4f46e5"
                strokeWidth={2}
                dot={{ fill: "#4f46e5", strokeWidth: 2 }}
                activeDot={{ r: 6, fill: "#4f46e5" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-4">Profit Growth</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart
              data={profitData}
              margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
            >
              <XAxis dataKey="year" stroke="#888888" fontSize={12} />
              <YAxis stroke="#888888" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "none",
                  borderRadius: "8px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }}
                cursor={{ fill: "rgba(16, 185, 129, 0.1)" }}
              />
              <Bar dataKey="value" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Peers Section */}
      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-3">Company Peers</h3>
        <div className="space-y-2">
          {(showAllPeers ? peers : peers.slice(0, 5)).map(
            (
              peer: { company_name: string; company_screener: string },
              index: number
            ) => (
              <div
                key={index}
                className="flex justify-between items-center border-b pb-2"
              >
                <span>{peer.company_name}</span>
                <Link href={peer.company_screener} target="_blank">
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                </Link>
              </div>
            )
          )}
        </div>
        {peers.length > 5 && (
          <Button
            variant="ghost"
            className="mt-3 w-full"
            onClick={() => setShowAllPeers(!showAllPeers)}
          >
            {showAllPeers ? "Show Less" : "Show More"}
          </Button>
        )}
      </Card>
    </div>
  );
};

export default CompanyDetails;
