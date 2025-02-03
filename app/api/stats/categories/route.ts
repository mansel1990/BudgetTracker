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

  const stats = await getCategoriesStats(
    groupId,
    queryParams.data.from,
    queryParams.data.to
  );

  return Response.json(stats);
}

export type getCategoriesStatsResponseType = Awaited<
  ReturnType<typeof getCategoriesStats>
>;

const getCategoriesStats = async (groupId: number, from: Date, to: Date) => {
  const stats = await prisma.transactions.groupBy({
    by: ["type", "category", "category_icon"],
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
    orderBy: {
      _sum: {
        amount: "desc",
      },
    },
  });

  return stats;
};
