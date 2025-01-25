"use client";

import { ThemeProvider } from "next-themes";
import React, { ReactNode, useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const RootProviders = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState(true);
  const [queryClient] = useState(() => new QueryClient());

  useEffect(() => {
    setLoading(false);
  }, []);

  if (loading) return null;

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem
        disableTransitionOnChange
      >
        {children}
      </ThemeProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default RootProviders;
