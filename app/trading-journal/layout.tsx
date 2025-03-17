"use client";

import TradingNavbar from "@/components/TradingNavbar";
import React, { ReactNode } from "react";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className={`relative flex h-screen-dynamic w-full flex-col`}>
      <TradingNavbar />
      <div className="w-full">{children}</div>
    </div>
  );
};

export default Layout;
