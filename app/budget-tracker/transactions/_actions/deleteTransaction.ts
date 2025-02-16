"use server";

import { prisma } from "@/lib/prisma";
import { getUserGroup } from "@/lib/session";

export async function DeleteTransaction(transactionId: number) {
  const { groupId } = await getUserGroup();

  const transaction = await prisma.transactions.findUnique({
    where: {
      transaction_id: transactionId,
      group_id: groupId,
    },
  });

  if (!transaction) {
    throw new Error("Transaction not found");
  }

  await prisma.$transaction([
    prisma.transactions.delete({
      where: {
        transaction_id: transactionId,
        group_id: groupId,
      },
    }),
    prisma.month_history.update({
      where: {
        group_id_year_month_day: {
          group_id: groupId,
          day: transaction.date?.getUTCDate() ?? 0,
          month: transaction.date?.getUTCMonth() ?? 0,
          year: transaction.date?.getUTCFullYear() ?? 0,
        },
      },
      data: {
        ...(transaction.type === "expense" && {
          expense: { decrement: transaction.amount ?? 0 },
        }),
        ...(transaction.type === "income" && {
          income: { decrement: transaction.amount ?? 0 },
        }),
      },
    }),
    prisma.year_history.update({
      where: {
        group_id_year_month: {
          group_id: groupId,
          month: transaction.date?.getUTCMonth() ?? 0,
          year: transaction.date?.getUTCFullYear() ?? 0,
        },
      },
      data: {
        ...(transaction.type === "expense" && {
          expense: { decrement: transaction.amount ?? 0 },
        }),
        ...(transaction.type === "income" && {
          income: { decrement: transaction.amount ?? 0 },
        }),
      },
    }),
  ]);
}
