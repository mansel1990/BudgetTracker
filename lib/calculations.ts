import { FundTransaction, Prisma } from "@prisma/client";

export const calculateFundStats = (transactions: FundTransaction[]) => {
  // Ensure transactions are processed in chronological order
  transactions.sort(
    (a, b) =>
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );

  let totalDeposited = 0;
  let totalWithdrawn = 0;
  let currentMarketValue = 0;
  const transactionHistory: {
    date: string;
    deposits: number;
    withdrawals: number;
    marketValue: number;
  }[] = [];

  transactions.forEach((t) => {
    if (t.type === "deposit") {
      totalDeposited += Number(t.amount);
      currentMarketValue += Number(t.amount);
    } else if (t.type === "withdraw") {
      totalWithdrawn += Number(t.amount);
      // When a withdrawal occurs, update the market value as provided by the user
      currentMarketValue = Number(t.amount_in_market) || 0;
    }

    const formattedDate = new Date(t.created_at).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

    transactionHistory.push({
      date: formattedDate,
      deposits: totalDeposited,
      withdrawals: totalWithdrawn,
      marketValue: currentMarketValue,
    });
  });

  const realizedProfit = Math.round(
    totalWithdrawn + currentMarketValue - totalDeposited
  );

  // Find the largest transaction for additional stats
  const largestTransaction =
    transactions.length > 0
      ? transactions.reduce(
          (max, t) => (Number(t.amount) > Number(max.amount) ? t : max),
          transactions[0]
        )
      : null;

  const firstInvestment = transactions.find((t) => t.type === "deposit");
  const firstInvestmentDate = firstInvestment?.created_at
    ? new Date(firstInvestment.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return {
    amountInMarket: currentMarketValue,
    totalDeposited,
    totalWithdrawn,
    realizedProfit,
    profitPercentage:
      totalDeposited > 0 ? (realizedProfit / totalDeposited) * 100 : 0,
    depositCount: transactions.filter((t) => t.type === "deposit").length,
    withdrawalCount: transactions.filter((t) => t.type === "withdraw").length,
    largestTransaction: largestTransaction
      ? Number(largestTransaction.amount)
      : 0,
    largestTransactionType: largestTransaction?.type ?? null,
    largestTransactionDate: largestTransaction?.created_at ?? null,
    firstInvestmentDate,
    transactionHistory,
  };
};

export type FundStats = ReturnType<typeof calculateFundStats>;
