"use client";

import React, { useState } from "react";
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

const columns = [
  columnHelper.accessor("company_name", {
    header: (props) => (
      <DataTableColumnHeader column={props.column} title="Company" />
    ),
    cell: ({ row }) => (
      <a
        href={row.original.company_screener}
        className="text-blue-500 underline max-w-[250px] truncate block"
        target="_blank"
        rel="noopener noreferrer"
      >
        {row.original.company_symbol} - {row.original.company_name}
      </a>
    ),
  }),
  columnHelper.accessor("sector", {
    header: "Sector",
    cell: ({ row }) => (
      <div className="max-w-[250px] truncate block">{row.original.sector}</div>
    ),
  }),
  columnHelper.accessor("final_score", {
    header: "Score",
    cell: ({ getValue }) => <span>{getValue()}</span>,
    sortingFn: "auto",
  }),
] as const;

const CompanyAnalysisTable: React.FC<Props> = ({ data = [] }) => {
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [globalFilter, setGlobalFilter] = useState("");

  const toggleRow = (id: string) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  const table = useReactTable({
    data,
    columns: [...columns] as ColumnDef<CompanyAnalysisType, any>[],
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
                  <TableHead className="w-12">Details</TableHead>
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
                      <TableCell className="w-12 text-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleRow(row.id)}
                        >
                          {expandedRow === row.id ? (
                            <ChevronDown />
                          ) : (
                            <ChevronRight />
                          )}
                        </Button>
                      </TableCell>
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
