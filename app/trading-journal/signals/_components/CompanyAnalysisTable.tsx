"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ColumnDef,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DataTableColumnHeader } from "@/components/datatable/ColumnHeader";
import SkeletonWrapper from "@/components/SkeletonWrapper";
import { ChevronDown, ChevronRight } from "lucide-react";
import { CompanyAnalysisType } from "@/schema/companyAnalysis";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface Props {
  data: CompanyAnalysisType[];
}

const columnHelper = createColumnHelper<CompanyAnalysisType>();

const CompanyAnalysisTable: React.FC<Props> = ({ data = [] }) => {
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [globalFilter, setGlobalFilter] = useState("");
  const router = useRouter(); // ✅ Moved inside component

  const toggleRow = (id: string) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  const columns: ColumnDef<CompanyAnalysisType, any>[] = [
    columnHelper.accessor("company_name", {
      header: (props) => (
        <DataTableColumnHeader column={props.column} title="Company" />
      ),
      cell: ({ row }) => (
        <span
          className="text-blue-500 underline cursor-pointer max-w-[250px] truncate block"
          onClick={() =>
            router.push(
              `/trading-journal/signals/${row.original.company_symbol}`
            )
          }
        >
          {row.original.company_symbol} - {row.original.company_name}
        </span>
      ),
    }),
    columnHelper.accessor("sector", {
      header: "Sector",
      cell: ({ row }) => (
        <div className="max-w-[250px] truncate block">
          {row.original.sector}
        </div>
      ),
    }),
    columnHelper.accessor("final_score", {
      header: "Score",
      cell: ({ getValue }) => {
        const value = getValue();
        const percentage = (Number(value || 0) / 32) * 100;
        return (
          <div className="flex items-center gap-2 w-32">
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${percentage}%` }}
              />
            </div>
            <span className="text-sm font-medium whitespace-nowrap">
              {((Number(value || 0) / 32) * 100).toFixed(0)}%
            </span>
          </div>
        );
      },
      sortingFn: "auto",
    }),
    columnHelper.accessor("Indicator", {
      header: "Signal",
      cell: ({ row }) => (
        <div
          className={`w-4 h-4 rounded-full ${
            row.original.Indicator === "Buy/Hold"
              ? "bg-green-500 shadow-lg shadow-green-500/50"
              : "bg-red-500 shadow-lg shadow-red-500/50"
          }`}
        />
      ),
    }),
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    initialState: { sorting: [{ id: "final_score", desc: true }] },
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
  });

  return (
    <div className="w-full">
      <Input
        placeholder="Search..."
        value={globalFilter}
        onChange={(e) => setGlobalFilter(e.target.value)}
        className="mb-4"
      />
      <SkeletonWrapper isLoading={!data.length}>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <React.Fragment key={row.id}>
                    <TableRow>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                    {expandedRow === row.id && (
                      <TableRow>
                        <TableCell colSpan={columns.length + 1}>
                          <div className="p-4 bg-gray-200 dark:bg-gray-800 rounded-md text-gray-900 dark:text-gray-100">
                            <p className="text-sm font-semibold">
                              Score Details
                            </p>
                            <div className="w-full h-32">
                              <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                  layout="vertical"
                                  data={[
                                    {
                                      name: "PE",
                                      score: row.original.pe_score,
                                    },
                                    {
                                      name: "PEG",
                                      score: row.original.peg_score,
                                    },
                                    {
                                      name: "DE",
                                      score: row.original.de_score,
                                    },
                                    {
                                      name: "Piotroski",
                                      score: row.original.piotroski_score,
                                    },
                                    {
                                      name: "Sales",
                                      score: row.original.sales_score,
                                    },
                                    {
                                      name: "Profit",
                                      score: row.original.profit_score,
                                    },
                                    { name: "ROE", score: row.original.score },
                                  ]}
                                >
                                  <XAxis type="number" domain={[0, 1]} hide />
                                  <YAxis
                                    dataKey="name"
                                    type="category"
                                    width={80}
                                  />
                                  <Tooltip />
                                  <Bar
                                    dataKey="score"
                                    fill="#10B981"
                                    barSize={6}
                                  />
                                </BarChart>
                              </ResponsiveContainer>
                            </div>
                            <p className="text-sm font-semibold mt-4">
                              Total Filter Score:{" "}
                              {row.original.Total_Filter_Score} / 36
                            </p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length + 1}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <div className="flex justify-end space-x-2 p-4">
            <Button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <span className="px-4">
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </span>
            <Button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      </SkeletonWrapper>
    </div>
  );
};

export default CompanyAnalysisTable;
