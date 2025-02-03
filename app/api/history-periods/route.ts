import { prisma } from "@/lib/prisma";
import { getUserGroup } from "@/lib/session";

export async function GET(request: Request) {
  const { groupId } = await getUserGroup();

  const periods = await getHistoryPeriods(groupId);
  return Response.json(periods);
}

export type getHistoryPeriodsResponseType = Awaited<
  ReturnType<typeof getHistoryPeriods>
>;

const getHistoryPeriods = async (groupId: number) => {
  const result = await prisma.month_history.findMany({
    where: {
      group_id: groupId,
    },
    select: {
      year: true,
    },
    distinct: ["year"],
    orderBy: {
      year: "asc",
    },
  });

  const years = result.map((item) => item.year);

  if (years.length === 0) {
    return [new Date().getFullYear()];
  }

  return years;
};
