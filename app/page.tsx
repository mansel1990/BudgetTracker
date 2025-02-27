"use client";

import MainNavbar from "@/components/MainNavbar";
import Link from "next/link";
import { motion } from "framer-motion";
import { useUser } from "@clerk/nextjs";

export default function Home() {
  const { user } = useUser();
  const userName = user?.firstName || "______";

  return (
    <div className="flex flex-col h-screen">
      <MainNavbar />

      <div className="flex flex-1 flex-col items-center justify-center px-4 gap-6">
        {/* Animated Welcome Text */}
        <h1 className="text-3xl sm:text-4xl font-bold text-center flex">
          Welcome, &nbsp;
          <motion.span
            className="bg-gradient-to-r from-blue-400 to-violet-500 bg-clip-text text-transparent"
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              transition: { duration: 2, ease: "easeInOut" },
            }}
          >
            {userName.split("").map((letter, index) => (
              <motion.span
                key={index}
                className="inline-block"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                }}
                transition={{
                  delay: index * 0.2, // Delay for typewriter effect
                }}
              >
                {letter}
              </motion.span>
            ))}
          </motion.span>
          👋
        </h1>

        {/* Cards Section */}
        <div className="grid w-full max-w-3xl grid-cols-1 sm:grid-cols-2 gap-6">
          <Link
            href="/budget-tracker"
            className="flex flex-col items-center justify-center p-8 bg-blue-500 text-white rounded-2xl shadow-xl text-center hover:bg-blue-600 transition-transform transform hover:scale-105"
          >
            <h2 className="text-2xl font-bold">Budget Tracker</h2>
          </Link>

          <Link
            href="/trading-journal"
            className="flex flex-col items-center justify-center p-8 bg-green-500 text-white rounded-2xl shadow-xl text-center hover:bg-green-600 transition-transform transform hover:scale-105"
          >
            <h2 className="text-2xl font-bold">Trading Journal</h2>
          </Link>
        </div>
      </div>
    </div>
  );
}
