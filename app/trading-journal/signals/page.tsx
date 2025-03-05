"use client";

import React from "react";
import TradingSignalsTable from "./_components/TradingSignalsTable";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  checkTradeSignalAccess,
  requestTradeSignalAccess,
} from "./_actions/tradeSignals";
import { toast } from "sonner";
import SkeletonWrapper from "@/components/SkeletonWrapper";
import { Button } from "@/components/ui/button";

const sampleData = [
  {
    aggregate_score: 8.2,
    company_name: "Dummy Corp",
    company_link: "/screener/dummy",
    company_peers: [
      {
        company_name: "Peer 1",
        company_symbol: "P1",
        company_link: "/screener/dummy1",
      },
      {
        company_name: "Peer 2",
        company_symbol: "P2",
        company_link: "/screener/dummy3",
      },
      {
        company_name: "Peer 3",
        company_symbol: "P3",
        company_link: "/screener/dummy4",
      },
    ],
    company_symbol: "dummy",
    date: "2025-03-05T10:48:13.522883",
    de: 0.5,
    de_ranking: 2,
    de_score: 7.8,
    industry: "Software",
    industry_pe: 20.8,
    industry_peg: 1.5,
    industry_piotroski: 6.5,
    median_pe: 22.5,
    pe: 25.3,
    pe_score: 7.5,
    peg: 1.2,
    peg_ranking: 3,
    peg_score: 8,
    piotroski: 7,
    piotroski_rank: 4,
    piotroski_score: 7.2,
    profit_growth: [4.5, 5, 4.2],
    profit_growth_rank: [2, 1, 3],
    profit_growth_score: 7.8,
    profit_growth_symbol: 1,
    roe: [15, 18, 14],
    roe_rank: [2, 1, 3],
    roe_symbol: 1,
    row_score: 8,
    sales_growth: [5.1, 6.2, 4.8],
    sales_growth_rank: [1, 3, 2],
    sales_growth_score: 8.5,
    sales_growth_symbol: 1,
    sector: "Technology",
  },
];

const page = () => {
  const queryClient = useQueryClient();

  // Fetch access status
  const { data, isLoading } = useQuery({
    queryKey: ["tradeSignalAccess"],
    queryFn: checkTradeSignalAccess,
  });

  const requestMutation = useMutation({
    mutationFn: requestTradeSignalAccess,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tradeSignalAccess"] });
      toast.success("Access requested");
    },
    onError: (error) => {
      toast.error(`Error: ${error.message}`);
    },
  });
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Trade Signals</h1>
      <SkeletonWrapper isLoading={isLoading}>
        {data?.hasAccess ? (
          <div>
            <TradingSignalsTable data={sampleData} />
          </div>
        ) : (
          <Button
            variant="outline"
            className="bg-gradient-to-r from-rose-600 to-rose-500 
            text-sm sm:text-base text-white 
            hover:from-rose-500 hover:to-rose-400 
            transition-all duration-300 ease-in-out 
            shadow-md hover:shadow-lg 
            rounded-lg border-none
            w-full sm:w-auto 
            px-6 py-2.5"
            onClick={() => requestMutation.mutate()}
            disabled={requestMutation.isPending}
          >
            {requestMutation.isPending ? "Requesting..." : "Request Access"}
          </Button>
        )}
      </SkeletonWrapper>
    </div>
  );
};

export default page;
