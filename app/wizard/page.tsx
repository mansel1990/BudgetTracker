import CurrencyComboBox from "@/components/CurrencyComboBox";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { currentUser } from "@clerk/nextjs/server";
import { Separator } from "@radix-ui/react-context-menu";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";
import GroupEdit from "@/components/GroupEdit";

const page = async () => {
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }

  return (
    <div className="container flex max-w-2xl px-4 flex-col items-center justify-start gap-6 md:gap-8 min-h-screen pt-10">
      <div className="text-center">
        <h1 className="text-3xl md:text-4xl font-semibold">
          Welcome, <span className="ml-2 font-bold">{user.firstName} 👏</span>
        </h1>
        <h2 className="mt-4 text-base text-muted-foreground sm:text-lg">
          Let's get started by setting your currency and group
        </h2>
        <h3 className="mt-2 text-sm text-muted-foreground sm:text-base">
          You can change these settings anytime
        </h3>
      </div>
      <Separator />

      {/* Currency Section */}
      <Card className="w-full md:w-3/4">
        <CardHeader>
          <CardTitle>Currency</CardTitle>
          <CardDescription>
            Set your default currency for transactions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CurrencyComboBox />
        </CardContent>
      </Card>
      <Separator />

      {/* Group Section */}
      <Card className="w-full md:w-3/4">
        <CardHeader>
          <CardTitle>Group</CardTitle>
          <CardDescription>
            You can handle your budget alone or with a group. Please update your
            group details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <GroupEdit />
        </CardContent>
      </Card>

      {/* Done Button */}
      <Button
        className="w-full py-3 text-lg font-semibold transition-colors duration-200 bg-gray-800 hover:bg-gray-900 rounded-md"
        asChild
      >
        <Link href={"/"}>I'm done! Take me to the dashboard</Link>
      </Button>

      <div className="mt-4">
        <Logo />
      </div>
    </div>
  );
};

export default page;
