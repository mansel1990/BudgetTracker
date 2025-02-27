"use client";

import React from "react";
import { Button } from "./ui/button";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import ModeToggle from "./ThemeSwitcherBtn";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "./ui/sheet";
import { Menu } from "lucide-react";
import AppLogo, { AppLogoMobile } from "./AppLogo";

const DesktopNavbar = () => {
  return (
    <div className="hidden border-b bg-background md:block">
      <nav className="w-full flex items-center justify-between px-8">
        <div className="flex h-[80px] min-h-[60px] items-center gap-x-4">
          <AppLogo />
        </div>
        <div className="flex items-center gap-2">
          <ModeToggle />
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
      </nav>
    </div>
  );
};

const MobileNavbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="block border-b bg-background md:hidden">
      <nav className="container flex items-center justify-between px-8">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant={"ghost"} size={"icon"}>
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent className="w-[400px] sm:w-[540px]" side="left">
            <SheetTitle>
              <AppLogoMobile />
            </SheetTitle>
          </SheetContent>
        </Sheet>
        <div className="flex h-[80px] min-h-[60px] items-center gap-x-4">
          <AppLogoMobile />
        </div>
        <div className="flex items-center gap-2">
          <ModeToggle />
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
      </nav>
    </div>
  );
};

const MainNavbar = () => {
  return (
    <>
      <DesktopNavbar />
      <MobileNavbar />
    </>
  );
};

export default MainNavbar;
