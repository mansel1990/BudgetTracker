"use client";

import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import FetchForm from "./components/FetchForm";
import EmailTable from "./components/EmailTable";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { CreateTransactionsBulk } from "../_actions/transactions";
import { CreateTransactionSchemaType } from "@/schema/transaction";

interface Email {
  sender: string;
  subject: string;
  date: string;
  body: string;
}

interface Transaction {
  id: string;
  amount: number;
  description: string;
  category: string;
  transactionDate: string;
}

const fetchEmails = async (date: string) => {
  const response = await fetch(`/api/emails?date=${date}`);
  if (!response.ok) throw new Error("Failed to fetch emails");
  return response.json();
};

const EmailFetcher = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedRows, setSelectedRows] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (transactions.length > 0) {
      setSelectedRows((prev) =>
        transactions.reduce(
          (acc, txn) => ({ ...acc, [txn.id]: prev[txn.id] ?? true }),
          {}
        )
      );
    }
  }, [transactions]);

  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: CreateTransactionsBulk, // Use the bulk function
    onSuccess: () => {
      toast.success("Transactions created successfully 🎉", {
        id: "create-transactions",
      });

      setTransactions([]);
      setSelectedRows({});

      queryClient.invalidateQueries({
        queryKey: ["overview"],
      });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create transactions 🚨", {
        id: "create-transactions-error",
      });
    },
  });

  const handleUpdate = () => {
    const checkedTransactions: CreateTransactionSchemaType[] = transactions
      .filter((txn) => selectedRows[txn.id])
      .map((txn) => ({
        amount: Number(txn.amount),
        description: txn.description || "",
        date: new Date(
          Date.UTC(
            selectedDate.getFullYear(),
            selectedDate.getMonth(),
            selectedDate.getDate()
          )
        ),
        category: txn.category,
        type: "expense",
      }));

    mutate(checkedTransactions);
  };

  const {
    data: emails = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["emails", selectedDate],
    queryFn: () => fetchEmails(selectedDate.toISOString()),
    enabled: false,
  });

  // ✅ Use useEffect to update transactions safely
  useEffect(() => {
    if (emails.length > 0 && transactions.length === 0) {
      setTransactions(emails);
    }
  }, [emails]);

  const handleCategoryChange = (id: string, newCategory: string) => {
    setTransactions((prev) =>
      prev.map((txn) =>
        txn.id === id ? { ...txn, category: newCategory } : txn
      )
    );
  };

  return (
    <div className="container mx-auto p-6">
      <Card className="shadow-lg border rounded-2xl p-4">
        <CardHeader>
          <CardTitle className="text-xl font-bold">
            Fetch Emails by Date
          </CardTitle>
        </CardHeader>
        <CardContent>
          <FetchForm
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            refetch={refetch}
            isLoading={isLoading}
          />
        </CardContent>
      </Card>

      <EmailTable
        transactions={transactions}
        onCategoryChange={handleCategoryChange}
        selectedRows={selectedRows}
        setSelectedRows={setSelectedRows}
      />
      <Button onClick={handleUpdate} className="mt-4">
        Update
      </Button>
    </div>
  );
};

export default EmailFetcher;
