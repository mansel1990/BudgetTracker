import { Sparkles } from "lucide-react";
import React from "react";

const AppLogo = () => {
  return (
    <a href="/" className="flex items-center gap-2">
      <Sparkles className="h-10 w-10 stroke-amber-500 stroke-[1.5]" />
      <p className="bg-gradient-to-r from-amber-500 via-orange-400 to-emerald-500 bg-clip-text text-3xl font-bold leading-tight tracking-tighter text-transparent">
        Mansel Finance
      </p>
    </a>
  );
};

export const AppLogoMobile = () => {
  return (
    <a href="/" className="flex items-center gap-2">
      <p className="bg-gradient-to-r from-amber-500 via-orange-400 to-emerald-500 bg-clip-text text-2xl sm:text-3xl font-bold leading-tight tracking-tighter text-transparent">
        Mansel Finance
      </p>
    </a>
  );
};

export default AppLogo;
