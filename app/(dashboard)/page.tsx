import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";
import CreateTransactionDialog from "./_components/CreateTransactionDialog";

const page = async () => {
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }
  const userSettings = await prisma.user_settings.findUnique({
    where: {
      clerk_user_id: user.id,
    },
  });
  if (!userSettings || !userSettings.group_id) {
    redirect("/wizard");
  }

  return (
    <div className="h-full bg-background">
      <div className="border-b bg-card">
        <div className="container mx-auto flex flex-col sm:flex-row items-center sm:justify-between gap-4 py-6 sm:py-8">
          <p className="text-xl sm:text-3xl font-bold text-center sm:text-left">
            Hello, {user.firstName}! 👏
          </p>
          <div className="flex gap-2 sm:gap-3">
            <CreateTransactionDialog
              trigger={
                <Button
                  variant={"outline"}
                  className="border-emerald-500 bg-emerald-950 text-sm sm:text-base text-white hover:bg-emerald-700 hover:text-white w-full sm:w-auto"
                >
                  New income 🤑
                </Button>
              }
              type={"income"}
            />
            <CreateTransactionDialog
              trigger={
                <Button
                  variant={"outline"}
                  className="border-rose-500 bg-rose-950 text-sm sm:text-base text-white hover:bg-rose-700 hover:text-white w-full sm:w-auto"
                >
                  New expense 💸
                </Button>
              }
              type={"expense"}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
