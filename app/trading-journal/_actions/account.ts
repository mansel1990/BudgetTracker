"use server";

import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function createAccount(name: string) {
  try {
    const user = await currentUser();
    if (!user) {
      redirect("/sign-in");
    }
    const account = await prisma.account.create({
      data: { name, userId: user.id },
    });
    return { success: true, data: account };
  } catch (error) {
    console.error("Error creating account:", error);
    return { success: false, error: "Failed to create account" };
  }
}

export async function getAccount(accountId: number) {
  try {
    const account = await prisma.account.findUnique({
      where: { account_id: accountId },
      include: {
        transactions: true,
        trades: true,
      },
    });
    return { success: true, data: account };
  } catch (error) {
    console.error("Error fetching account:", error);
    return { success: false, error: "Failed to fetch account" };
  }
}
