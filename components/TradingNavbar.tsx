"use client";

import React from "react";
import TradingJournalLogo, {
  TradingJournalLogoMobile,
} from "./TradingJournalLogo";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "./ui/button";
import { usePathname } from "next/navigation";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import ModeToggle from "./ThemeSwitcherBtn";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "./ui/sheet";
import { Menu } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

const baseItems = [
  { label: "Dashboard", link: "/trading-journal" },
  { label: "Trades", link: "/trading-journal/trades" },
  { label: "Signals", link: "/trading-journal/signals" },
];

const fetchAccountDetails = async () => {
  const response = await fetch("/api/trading-journal/accounts");
  if (!response.ok) throw new Error("Failed to fetch account details");
  return response.json();
};

const NavbarItem = ({
  label,
  link,
  onClick,
}: {
  label: string;
  link: string;
  onClick?: () => void;
}) => {
  const pathname = usePathname();
  const isActive = pathname === link;

  return (
    <div className="relative flex items-center">
      <Link
        href={link}
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "w-full justify-start text-lg text-muted-foreground hover:text-foreground",
          isActive && "text-foreground"
        )}
        onClick={onClick}
      >
        {label}
      </Link>
      {isActive && (
        <div className="absolute -bottom-[2px] left-1/2 hidden h-[2px] w-[80%] -translate-x-1/2 rounded-xl bg-foreground md:block" />
      )}
    </div>
  );
};

const DesktopNavbar = ({ items }: { items: typeof baseItems }) => {
  return (
    <div className="hidden border-separate border-b bg-background md:block">
      <nav className="w-full flex items-center justify-between px-8">
        <div className="flex h-[80px] min-h-[60px] items-center gap-x-4">
          <TradingJournalLogo />
          <div className="flex h-full">
            {items.map((item) => (
              <NavbarItem
                key={item.label}
                label={item.label}
                link={item.link}
              />
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ModeToggle />
          <div className="flex items-center space-x-4">
            <SignedOut>
              <SignInButton>
                <button className="bg-amber-500 text-white px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base rounded-lg hover:bg-amber-600 transition duration-200">
                  Sign In
                </button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </div>
      </nav>
    </div>
  );
};

const MobileNavbar = ({ items }: { items: typeof baseItems }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="block border-separate bg-background md:hidden">
      <nav className="container flex items-center justify-between px-8">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant={"ghost"} size={"icon"}>
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent className="w-[400px] sm:w-[540px]" side="left">
            <SheetTitle>
              <TradingJournalLogo />
            </SheetTitle>
            <div className="flex flex-col gap-1 pt-4">
              {items.map((item) => (
                <NavbarItem
                  key={item.label}
                  label={item.label}
                  link={item.link}
                  onClick={() => setIsOpen(false)}
                />
              ))}
            </div>
          </SheetContent>
        </Sheet>
        <div className="flex h-[80px] min-h-[60px] items-center gap-x-4">
          <TradingJournalLogoMobile />
        </div>
        <div className="flex items-center gap-2">
          <ModeToggle />
          <div className="flex items-center space-x-4">
            <SignedOut>
              <SignInButton>
                <button className="bg-amber-500 text-white px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base rounded-lg hover:bg-amber-600 transition duration-200">
                  Sign In
                </button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </div>
      </nav>
    </div>
  );
};

const TradingNavbar = () => {
  const { data: account } = useQuery({
    queryKey: ["account"],
    queryFn: fetchAccountDetails,
  });

  const navItems = account?.is_admin
    ? [...baseItems, { label: "Admin", link: "/trading-journal/admin" }]
    : baseItems;

  return (
    <>
      <DesktopNavbar items={navItems} />
      <MobileNavbar items={navItems} />
    </>
  );
};

export default TradingNavbar;
