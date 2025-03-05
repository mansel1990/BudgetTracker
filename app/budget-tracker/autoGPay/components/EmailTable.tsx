"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import CategoryPicker from "../../_components/CategoryPicker";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";

interface Transaction {
  id: string;
  description: string;
  amount: number;
  category: string;
}

interface EmailTableProps {
  transactions: Transaction[];
  onCategoryChange: (id: string, newCategory: string) => void;
  selectedRows: Record<string, boolean>;
  setSelectedRows: React.Dispatch<
    React.SetStateAction<Record<string, boolean>>
  >;
}

const EmailTable = ({
  transactions,
  onCategoryChange,
  selectedRows,
  setSelectedRows,
}: EmailTableProps) => {
  const handleCheckboxChange = (id: string) => {
    setSelectedRows((prev) => ({
      ...prev,
      [id]: !prev[id], // Toggle selection
    }));
  };
  return (
    <Card className="mt-6 shadow-lg border rounded-2xl overflow-hidden">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <input
                  type="checkbox"
                  checked={Object.values(selectedRows).every(Boolean)}
                  onChange={() => {
                    const allSelected =
                      Object.values(selectedRows).every(Boolean);
                    setSelectedRows((prev) =>
                      Object.keys(prev).reduce(
                        (acc, id) => ({ ...acc, [id]: !allSelected }),
                        {}
                      )
                    );
                  }}
                />
              </TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Category</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.length > 0 ? (
              transactions.map((txn) => (
                <TableRow key={txn.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedRows[txn.id] || false}
                      onCheckedChange={() => handleCheckboxChange(txn.id)}
                    />
                  </TableCell>
                  <TableCell>{txn.description}</TableCell>
                  <TableCell>₹{txn.amount.toFixed(2)}</TableCell>
                  <TableCell>
                    <CategoryPicker
                      type="expense"
                      value={txn.category}
                      onChange={(newCategory) =>
                        onCategoryChange(txn.id, newCategory)
                      }
                    />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-gray-500">
                  No transactions found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default EmailTable;
