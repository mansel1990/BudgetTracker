"use client";

import Navbar from "@/components/Navbar";
import React, { ReactNode, useEffect } from "react";
import { useTheme } from "next-themes";
import RootProviders from "@/components/providers/RootProviders";

const Layout = ({ children }: { children: ReactNode }) => {
  const { resolvedTheme } = useTheme();
  const theme = resolvedTheme || "light";
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <div
      className={`relative flex h-screen-dynamic w-full flex-col ${theme}`}
      style={{ colorScheme: theme }}
    >
      {!loading && (
        <RootProviders>
          <Navbar />
          <div className="w-full">{children}</div>
        </RootProviders>
      )}
    </div>
  );
};

export default Layout;
