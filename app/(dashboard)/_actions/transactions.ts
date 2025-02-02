"use server";

import { prisma } from "@/lib/prisma";
import { getUserGroup } from "@/lib/session";
import {
  CreateTransactionSchema,
  CreateTransactionSchemaType,
} from "@/schema/transaction";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export const CreateTransaction = async (form: CreateTransactionSchemaType) => {
  const parsedBody = CreateTransactionSchema.safeParse(form);

  if (!parsedBody.success) {
    console.log(parsedBody.error);
    throw new Error(parsedBody.error.message);
  }

  const { groupId } = await getUserGroup();

  const { amount, category, date, description, type } = parsedBody.data;

  const categoryRow = await prisma.category.findFirst({
    where: {
      group_id: groupId,
      name: category,
    },
  });

  if (!categoryRow) {
    throw new Error("Category not found.");
  }

  await prisma.$transaction([
    // Create user transaction
    prisma.transactions.create({
      data: {
        amount,
        category: categoryRow.name,
        category_icon: categoryRow.icon,
        date,
        description,
        type,
        group_id: groupId,
      },
    }),

    // Update month aggregate table
    prisma.month_history.upsert({
      where: {
        group_id_year_month_day: {
          group_id: groupId,
          day: date.getUTCDate(),
          year: date.getUTCFullYear(),
          month: date.getUTCMonth(),
        },
      },
      create: {
        group_id: groupId,
        day: date.getUTCDate(),
        month: date.getUTCMonth(),
        year: date.getUTCFullYear(),
        expense: type === "expense" ? amount : 0,
        income: type === "income" ? amount : 0,
      },
      update: {
        expense: {
          increment: type === "expense" ? amount : 0,
        },
        income: {
          increment: type === "income" ? amount : 0,
        },
      },
    }),

    // Update year history
    prisma.year_history.upsert({
      where: {
        group_id_year_month: {
          group_id: groupId,
          month: date.getUTCMonth(),
          year: date.getUTCFullYear(),
        },
      },
      create: {
        group_id: groupId,
        month: date.getUTCMonth(),
        year: date.getUTCFullYear(),
        expense: type === "expense" ? amount : 0,
        income: type === "income" ? amount : 0,
      },
      update: {
        expense: {
          increment: type === "expense" ? amount : 0,
        },
        income: {
          increment: type === "income" ? amount : 0,
        },
      },
    }),
  ]);
};
