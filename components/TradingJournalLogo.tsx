import { LineChart } from "lucide-react";
import React from "react";

const TradingJournalLogo = () => {
  return (
    <a href="/" className="flex items-center gap-2">
      <LineChart className="h-10 w-10 stroke-green-500 stroke-[1.5]" />
      <p className="bg-gradient-to-r from-green-400 to-teal-500 bg-clip-text text-3xl font-bold leading-tight tracking-tighter text-transparent">
        Trading Journal
      </p>
    </a>
  );
};

export const TradingJournalLogoMobile = () => {
  return (
    <a href="/" className="flex items-center gap-2">
      <p className="bg-gradient-to-r from-green-400 to-teal-500 bg-clip-text text-2xl sm:text-3xl font-bold leading-tight tracking-tighter text-transparent">
        Trading Journal
      </p>
    </a>
  );
};

export default TradingJournalLogo;
