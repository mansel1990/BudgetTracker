import React from "react";
import Logo from "./Logo";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

const Header = () => {
  return (
    <header className="dark border-b border-gray-200">
      <div className="container mx-auto flex items-center justify-between py-4 px-6">
        <div className="flex-shrink-0">
          <Logo />
        </div>

        <nav className="flex items-center space-x-4">
          <SignedOut>
            <SignInButton>
              <button className="bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 transition duration-200">
                Sign In
              </button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </nav>
      </div>
    </header>
  );
};

export default Header;
