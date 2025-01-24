"use client";

import { ThemeProvider } from "next-themes";
import React, { ReactNode, useEffect, useState } from "react";

const RootProviders = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  if (loading) return null; 
  
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  );
};

export default RootProviders;
