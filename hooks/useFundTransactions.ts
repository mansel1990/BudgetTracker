import { FundTransaction } from "@/lib/types";
import { useState } from "react";

export function useFundTransactions() {
  const [transactions, setTransactions] = useState<FundTransaction[]>([]);

  const addTransaction = (
    transaction: Omit<FundTransaction, "id" | "date">
  ) => {
    const newTransaction = {
      id: Date.now(),
      date: new Date().toISOString(),
      ...transaction,
    };

    setTransactions([...transactions, newTransaction]);
  };

  const calculateBalance = () => {
    return transactions.reduce((acc, curr) => {
      return curr.type === "deposit" ? acc + curr.amount : acc - curr.amount;
    }, 0);
  };

  return {
    transactions,
    addTransaction,
    calculateBalance,
  };
}
