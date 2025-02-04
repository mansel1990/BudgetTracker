"use client";

import { DateRangePicker } from "@/components/ui/date-range-picker";
import { MAX_DATE_RANGE_DAYS } from "@/lib/constants";
import { differenceInDays, startOfMonth } from "date-fns";
import React, { useState } from "react";
import { toast } from "sonner";
import TransactionTable from "./_components/TransactionTable";
import ExpensePieChart from "./_components/ExpensePieChart";
import { getTransactionHistoryResponseType } from "@/app/api/transactions-history/route";

const TransactionsPage = () => {
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: startOfMonth(new Date()),
    to: new Date(new Date().setDate(new Date().getDate() + 1)),
  });

  const [transactions, setTransactions] =
    useState<getTransactionHistoryResponseType>([]);

  return (
    <>
      <div className="border-b bg-card">
        <div className="container mx-auto flex flex-wrap items-center justify-between gap-6 py-8">
          <div>
            <p className="text-2xl sm:text-3xl font-bold">
              Transaction History
            </p>
          </div>
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
      </div>
      <div className="container mx-auto">
        <TransactionTable
          from={dateRange.from}
          to={dateRange.to}
          onDataLoaded={setTransactions}
        />
        {transactions.length > 0 && <ExpensePieChart data={transactions} />}
      </div>
    </>
  );
};

export default TransactionsPage;
