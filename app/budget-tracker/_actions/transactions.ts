"use server";

import { prisma } from "@/lib/prisma";
import { getUserGroup } from "@/lib/session";
import {
  CreateTransactionSchema,
  CreateTransactionSchemaType,
} from "@/schema/transaction";

export const CreateTransaction = async (form: CreateTransactionSchemaType) => {
  const parsedBody = CreateTransactionSchema.safeParse(form);

  if (!parsedBody.success) {
    throw new Error(parsedBody.error.message);
  }

  const { groupId } = await getUserGroup();

  const { amount, category, date, description, type } = parsedBody.data;

  const categoryRow = await prisma.category.findFirst({
    where: {
      OR: [
        {
          group_id: groupId,
          name: category,
        },
        {
          group_id: 1,
          name: category,
        },
      ],
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

export const CreateTransactionsBulk = async (
  forms: CreateTransactionSchemaType[]
) => {
  // Validate all transactions
  const parsedForms = forms.map((form) =>
    CreateTransactionSchema.safeParse(form)
  );

  // Check for validation errors
  const invalidForms = parsedForms.filter((result) => !result.success);
  if (invalidForms.length > 0) {
    throw new Error(
      "Invalid transaction data: " +
        JSON.stringify(invalidForms.map((f) => f.error.message))
    );
  }

  // Extract valid transactions
  const transactions: CreateTransactionSchemaType[] = parsedForms
    .filter(
      (
        result
      ): result is { success: true; data: CreateTransactionSchemaType } =>
        result.success
    )
    .map((result) => result.data);

  if (transactions.length === 0) {
    console.log("🚫 No valid transactions to insert.");
    return;
  }

  // Fetch group ID once
  const { groupId } = await getUserGroup();

  // Get unique category names from transactions
  const categoryNames = [...new Set(transactions.map((txn) => txn.category))];

  // Fetch categories in a single query
  const categories = await prisma.category.findMany({
    where: {
      OR: categoryNames.flatMap((name) => [
        { group_id: groupId, name },
        { group_id: 1, name },
      ]),
    },
  });

  // Map categories by name
  const categoryMap = new Map(categories.map((cat) => [cat.name, cat]));

  // Validate that all categories exist
  for (const txn of transactions) {
    if (!categoryMap.has(txn.category)) {
      throw new Error(`Category not found: ${txn.category}`);
    }
  }

  // 🟢 Step 1: Fetch existing transactions for the same dates and amounts
  const existingTransactions = await prisma.transactions.findMany({
    where: {
      group_id: groupId,
      OR: transactions.map((txn) => ({
        amount: txn.amount,
        date: txn.date,
      })),
    },
    select: {
      amount: true,
      date: true,
    },
  });

  // Convert existing transactions to a Set for quick lookup
  const existingSet = new Set(
    existingTransactions.map(
      (txn) =>
        `${txn.amount}-${txn.date?.toISOString() ?? new Date().toISOString()}`
    )
  );

  // 🟢 Step 2: Filter out duplicate transactions
  const newTransactions = transactions.filter(
    (txn) => txn && !existingSet.has(`${txn.amount}-${txn.date.toISOString()}`)
  );

  if (newTransactions.length === 0) {
    console.log("🚫 No new transactions to insert (duplicates found)");
    throw new Error("No new transactions to insert (duplicates found)");
  }

  // 🟢 Step 3: Prepare Prisma transactions
  const prismaTransactions = newTransactions.map((txn) => {
    const category = categoryMap.get(txn.category);
    if (!category) throw new Error(`Category not found: ${txn.category}`);

    return prisma.transactions.create({
      data: {
        amount: txn.amount,
        category: category.name,
        category_icon: category.icon,
        date: txn.date,
        description: txn.description ?? "",
        type: txn.type,
        group_id: groupId,
      },
    });
  });

  // 🟢 Step 4: Prepare month history updates
  const monthUpdates = newTransactions.map((txn) =>
    prisma.month_history.upsert({
      where: {
        group_id_year_month_day: {
          group_id: groupId,
          day: txn.date.getUTCDate(),
          year: txn.date.getUTCFullYear(),
          month: txn.date.getUTCMonth(),
        },
      },
      create: {
        group_id: groupId,
        day: txn.date.getUTCDate(),
        month: txn.date.getUTCMonth(),
        year: txn.date.getUTCFullYear(),
        expense: txn.type === "expense" ? txn.amount : 0,
        income: txn.type === "income" ? txn.amount : 0,
      },
      update: {
        expense: {
          increment: txn.type === "expense" ? txn.amount : 0,
        },
        income: {
          increment: txn.type === "income" ? txn.amount : 0,
        },
      },
    })
  );

  // 🟢 Step 5: Prepare year history updates
  const yearUpdates = newTransactions.map((txn) =>
    prisma.year_history.upsert({
      where: {
        group_id_year_month: {
          group_id: groupId,
          month: txn.date.getUTCMonth(),
          year: txn.date.getUTCFullYear(),
        },
      },
      create: {
        group_id: groupId,
        month: txn.date.getUTCMonth(),
        year: txn.date.getUTCFullYear(),
        expense: txn.type === "expense" ? txn.amount : 0,
        income: txn.type === "income" ? txn.amount : 0,
      },
      update: {
        expense: {
          increment: txn.type === "expense" ? txn.amount : 0,
        },
        income: {
          increment: txn.type === "income" ? txn.amount : 0,
        },
      },
    })
  );

  // 🟢 Step 6: Run all transactions in a single Prisma transaction
  await prisma.$transaction([
    ...prismaTransactions,
    ...monthUpdates,
    ...yearUpdates,
  ]);
};
