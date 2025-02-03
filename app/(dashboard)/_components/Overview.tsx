"use client";

import { DateRangePicker } from "@/components/ui/date-range-picker";
import { MAX_DATE_RANGE_DAYS } from "@/lib/constants";
import { user_settings } from "@prisma/client";
import { differenceInDays, startOfMonth } from "date-fns";
import { difference } from "next/dist/build/utils";
import React, { useState } from "react";
import { toast } from "sonner";
import StatsCards from "./StatsCards";
import CategoriesStats from "./CategoriesStats";

const Overview = ({ userSettings }: { userSettings: user_settings }) => {
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: startOfMonth(new Date()),
    to: new Date(),
  });

  return (
    <>
      <div className="container mx-auto flex flex-wrap items-end justify-between gap-2 py-6">
        <h2 className="text-3xl font-bold">Overview</h2>
        <DateRangePicker
          initialDateFrom={dateRange.from}
          initialDateTo={dateRange.to}
          showCompare={false}
          onUpdate={(values) => {
            const { from, to } = values.range;
            if (!from || !to) return;
            if (differenceInDays(to, from) > MAX_DATE_RANGE_DAYS) {
              toast.error(
                `Date range must be less than ${MAX_DATE_RANGE_DAYS} days!`
              );
              return;
            }

            setDateRange({ from, to });
          }}
        />
      </div>
      <div className="container mx-auto flex w-full flex-col gap-2">
        <StatsCards
          from={dateRange.from}
          to={dateRange.to}
          userSettings={userSettings}
        />

        <CategoriesStats
          from={dateRange.from}
          to={dateRange.to}
          userSettings={userSettings}
        />
      </div>
    </>
  );
};

export default Overview;
