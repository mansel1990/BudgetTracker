import { prisma } from "@/lib/prisma";
import { getUserGroup } from "@/lib/session";
import { OverviewQuerySchema } from "@/schema/overview";

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

  const stats = await getBalanceStats(
    groupId,
    queryParams.data.from,
    queryParams.data.to
  );

  return Response.json(stats);
}

export type GetBalanceStatsResponseType = Awaited<
  ReturnType<typeof getBalanceStats>
>;
async function getBalanceStats(groupId: number, from: Date, to: Date) {
  const totals = await prisma.transactions.groupBy({
    by: ["type"],
    where: {
      group_id: groupId,
      date: {
        gte: from,
        lte: to,
      },
    },
    _sum: {
      amount: true,
    },
  });

  return {
    expense: totals.find((t) => t.type === "expense")?._sum?.amount ?? 0,
    income: totals.find((t) => t.type === "income")?._sum?.amount ?? 0,
  };
}
