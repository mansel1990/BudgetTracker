"use client";

import React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  checkTradeSignalAccess,
  requestTradeSignalAccess,
} from "./_actions/tradeSignals";
import { toast } from "sonner";
import SkeletonWrapper from "@/components/SkeletonWrapper";
import { Button } from "@/components/ui/button";
import CompanyAnalysisTable from "./_components/CompanyAnalysisTable";
import { useMediaQuery } from "@react-hook/media-query";
import CompanyAnalysisMobile from "./_components/CompanyAnalysisMobile";
import { CompanyAnalysisType } from "@/schema/companyAnalysis";

const page = () => {
  const queryClient = useQueryClient();

  const isMobile = useMediaQuery("(max-width: 768px)");

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

  const { data: companyAnalysisData } = useQuery({
    queryKey: ["companyAnalysis"],
    queryFn: async () => {
      const response = await fetch(
        "/api/trading-journal/trading-signals/company-analysis"
      );
      if (!response.ok) throw new Error("Failed to fetch data");
      return response.json();
    },
  });
  const parsedData = companyAnalysisData?.map((item: CompanyAnalysisType) => ({
    ...item,
    company_peers:
      typeof item.company_peers === "string"
        ? JSON.parse(item.company_peers)
        : item.company_peers,
    sales_growth:
      typeof item.sales_growth === "string"
        ? JSON.parse(item.sales_growth)
        : item.sales_growth,
    sales_rank:
      typeof item.sales_rank === "string"
        ? JSON.parse(item.sales_rank)
        : item.sales_rank,
    profit_growth:
      typeof item.profit_growth === "string"
        ? JSON.parse(item.profit_growth)
        : item.profit_growth,
    profit_rank:
      typeof item.profit_rank === "string"
        ? JSON.parse(item.profit_rank)
        : item.profit_rank,
    last_updated: new Date(item.last_updated),
    Indicator:
      item.Indicator === "Sell" || item.Indicator === "Buy/Hold"
        ? item.Indicator
        : "Buy/Hold", // Ensure valid type
    SellPrice: item.SellPrice ?? null, // Ensure null or number
  }));

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Trade Signals</h1>
      <SkeletonWrapper isLoading={isLoading}>
        {data?.hasAccess ? (
          <div>
            {isMobile ? (
              <CompanyAnalysisMobile data={parsedData} />
            ) : (
              <CompanyAnalysisTable data={parsedData} />
            )}
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
