import { GetFormatterForCurrency } from "@/lib/helpers";
import { prisma } from "@/lib/prisma";
import { getUserGroup } from "@/lib/session";
import { OverviewQuerySchema } from "@/schema/overview";
import { currentUser } from "@clerk/nextjs/server";

export async function GET(request: Request) {
  const { groupId } = await getUserGroup();

  const { searchParams } = new URL(request.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  const queryParams = OverviewQuerySchema.safeParse({
    from: from ? new Date(from) : undefined,
    to: to ? new Date(to) : undefined,
  });
  if (!queryParams.success) {
    return Response.json(queryParams.error.message, { status: 400 });
  }

  const transactions = await getTransactionHistory(
    groupId,
    queryParams.data.from,
    queryParams.data.to
  );

  return Response.json(transactions);
}

export type getTransactionHistoryResponseType = Awaited<
  ReturnType<typeof getTransactionHistory>
>;

const getTransactionHistory = async (groupId: number, from: Date, to: Date) => {
  const user = await currentUser();

  const userSettings = await prisma.user_settings.findUnique({
    where: { clerk_user_id: user?.id },
  });
  const formatter = GetFormatterForCurrency(userSettings?.currency ?? "INR");

  const transactions = await prisma.transactions.findMany({
    where: {
      group_id: groupId,
      date: {
        gte: from,
        lte: to,
      },
    },
    orderBy: {
      date: "desc",
    },
  });
  return transactions.map((transaction) => ({
    ...transaction,
    formattedAmount: formatter.format(Number(transaction.amount) ?? 0),
  }));
};
