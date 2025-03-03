"use client";

import { useQuery } from "@tanstack/react-query";

export const useTradingStats = () => {
  return useQuery({
    queryKey: ["fund-stats"],
    queryFn: async () => {
      const response = await fetch("/api/trading-journal/fund-stats");
      if (!response.ok) {
        throw new Error("Failed to fetch fund stats");
      }
      return response.json();
    },
  });
};
