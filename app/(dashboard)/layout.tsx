"use client";

import Navbar from "@/components/Navbar";
import React, { ReactNode } from "react";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className={`relative flex h-screen-dynamic w-full flex-col`}>
      <Navbar />
      <div className="w-full">{children}</div>
    </div>
  );
};

export default Layout;
