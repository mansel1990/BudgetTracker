import { prisma } from "@/lib/prisma";
import { getUserGroup } from "@/lib/session";
import { Period, Timeframe } from "@/lib/types";
import { getDaysInMonth } from "date-fns";
import { z } from "zod";

const getHistoryDataSchema = z.object({
  timeframe: z.enum(["year", "month"]),
  month: z.coerce.number().min(0).max(11).default(0),
  year: z.coerce.number(),
});

export async function GET(request: Request) {
  const { groupId } = await getUserGroup();

  const { searchParams } = new URL(request.url);
  const timeframe = searchParams.get("timeframe");
  const year = searchParams.get("year");
  const month = searchParams.get("month");

  const queryParams = getHistoryDataSchema.safeParse({
    timeframe,
    year,
    month,
  });

  if (!queryParams.success) {
    return Response.json(queryParams.error.message, { status: 400 });
  }

  const data = await getHistoryData(groupId, queryParams.data.timeframe, {
    month: queryParams.data.month,
    year: queryParams.data.year,
  });

  return Response.json(data);
}

export type getHistoryDataResponseType = Awaited<
  ReturnType<typeof getHistoryData>
>;

const getHistoryData = async (
  groupId: number,
  timeframe: Timeframe,
  period: Period
) => {
  switch (timeframe) {
    case "year": {
      return await getYearlyHistoryData(groupId, period.year);
    }
    case "month": {
      return await getMonthlyHistoryData(groupId, period.year, period.month);
    }
  }
};

type HistoryData = {
  expense: number;
  income: number;
  month: number;
  year: number;
  day?: number;
};
const getYearlyHistoryData = async (groupId: number, year: number) => {
  const result = await prisma.year_history.groupBy({
    by: ["month"],
    where: {
      group_id: groupId,
      year,
    },
    _sum: {
      expense: true,
      income: true,
    },
    orderBy: {
      month: "asc",
    },
  });

  if (!result || result.length === 0) return [];

  const history: HistoryData[] = [];

  for (let i = 0; i < 12; i++) {
    let expense = 0,
      income = 0;

    const month = result.find((item) => item.month === i);
    if (month) {
      expense = month._sum.expense?.toNumber() ?? 0;
      income = month._sum.income?.toNumber() ?? 0;
    }
    history.push({ expense, income, month: i, year });
  }

  return history;
};

const getMonthlyHistoryData = async (
  groupId: number,
  year: number,
  month: number
) => {
  const result = await prisma.month_history.groupBy({
    by: ["day"],
    where: {
      group_id: groupId,
      year,
      month,
    },
    _sum: {
      expense: true,
      income: true,
    },
    orderBy: {
      day: "asc",
    },
  });

  if (!result || result.length === 0) return [];

  const history: HistoryData[] = [];

  const daysInMonth = getDaysInMonth(new Date(year, month));

  for (let i = 0; i < daysInMonth; i++) {
    let expense = 0,
      income = 0;

    const day = result.find((item) => item.day === i);
    if (day) {
      expense = day._sum.expense?.toNumber() ?? 0;
      income = day._sum.income?.toNumber() ?? 0;
    }
    history.push({ expense, income, month, year, day: i });
  }

  return history;
};
