"use server";

import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

export async function createFundTransaction(data: {
  amount: number;
  type: "deposit" | "withdraw";
  amountInMarket?: number;
}) {
  try {
    const user = await currentUser();
    if (!user) {
      throw new Error("Unauthorized");
    }

    let account = await prisma.account.findUnique({
      where: { userId: user.id },
    });

    if (!account) {
      account = await prisma.account.create({
        data: {
          userId: user.id,
          name: user.firstName || "Default Account",
        },
      });
    }

    // For deposits, calculate new amount in market
    if (data.type === "deposit") {
      const currentMarket = await prisma.fundTransaction.findFirst({
        where: { account_id: account.account_id },
        orderBy: { created_at: "desc" },
        select: { amount_in_market: true },
      });

      const newMarketAmount =
        Number(currentMarket?.amount_in_market || 0) + data.amount;

      await prisma.fundTransaction.create({
        data: {
          account_id: account.account_id,
          amount: data.amount,
          type: data.type,
          amount_in_market: newMarketAmount,
        },
      });
    }
    // For withdrawals, verify and use provided amount in market
    else {
      if (typeof data.amountInMarket === "undefined") {
        throw new Error(
          "Amount remaining in market is required for withdrawals"
        );
      }

      const currentMarket = await prisma.fundTransaction.findFirst({
        where: { account_id: account.account_id },
        orderBy: { created_at: "desc" },
        select: { amount_in_market: true },
      });

      const currentAmount = Number(currentMarket?.amount_in_market || 0);

      if (currentAmount < data.amount) {
        throw new Error("Insufficient amount in market for withdrawal");
      }

      await prisma.fundTransaction.create({
        data: {
          account_id: account.account_id,
          amount: data.amount,
          type: data.type,
          amount_in_market: data.amountInMarket,
        },
      });
    }

    return { success: true };
  } catch (error) {
    console.error("Failed to create fund transaction:", error);
    throw error;
  }
}
