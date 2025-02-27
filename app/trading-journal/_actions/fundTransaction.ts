"use server";

import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

export async function createFundTransaction(data: {
  amount: number;
  type: "deposit" | "withdraw";
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
      // Create account if it doesn't exist
      const newAccount = await prisma.account.create({
        data: {
          userId: user.id,
          name: user.firstName || "Default Account",
          balance: 0,
        },
      });
      account = newAccount;
    }

    await prisma.$transaction([
      // Create fund transaction
      prisma.fundTransaction.create({
        data: {
          account_id: account.account_id,
          amount: data.amount,
          type: data.type,
        },
      }),

      // Update account balance
      prisma.account.update({
        where: { account_id: account.account_id },
        data: {
          balance: {
            [data.type === "deposit" ? "increment" : "decrement"]: data.amount,
          },
        },
      }),
    ]);

    return { success: true };
  } catch (error) {
    console.error("Failed to create fund transaction:", error);
    throw new Error("Failed to create fund transaction");
  }
}
