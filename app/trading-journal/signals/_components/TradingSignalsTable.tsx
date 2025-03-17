"use client";

import React, { useState } from "react";
import {
  ColumnDef,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
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
import { Button } from "@/components/ui/button";

interface Peer {
  company_name: string;
  company_symbol: string;
  company_link: string;
}

interface TradingSignal {
  aggregate_score: number;
  company_name: string;
  company_link: string;
  company_peers: Peer[];
  company_symbol: string;
  industry: string;
  sector: string;
}

interface Props {
  data: TradingSignal[];
}

const columnHelper = createColumnHelper<TradingSignal>();

const columns = [
  columnHelper.display({
    id: "expander",
    header: () => null,
    cell: ({ row, table }) => {
      const meta = table.options.meta as {
        toggleRow: (id: string) => void;
        expandedRows: Record<string, boolean>;
      };
      return (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => meta.toggleRow(row.id)}
        >
          {meta.expandedRows[row.id] ? <ChevronDown /> : <ChevronRight />}
        </Button>
      );
    },
  }),
  columnHelper.accessor("company_name", {
    header: (props) => (
      <DataTableColumnHeader column={props.column} title="Company Name" />
    ),
    cell: ({ row }) => (
      <a href={row.original.company_link} className="text-blue-500 underline">
        {row.original.company_symbol} - {row.original.company_name}
      </a>
    ),
  }),
  columnHelper.accessor((row) => row.aggregate_score, {
    id: "aggregate_score",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Aggregate Score" />
    ),
    cell: ({ getValue }) => <div>{getValue()}</div>,
  }),
  columnHelper.accessor((row) => row.industry, {
    id: "industry",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Industry" />
    ),
    cell: ({ getValue }) => <div>{getValue()}</div>,
  }),
  columnHelper.accessor((row) => row.sector, {
    id: "sector",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Sector" />
    ),
    cell: ({ getValue }) => <div>{getValue()}</div>,
  }),
  columnHelper.display({
    id: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Signal" />
    ),
    cell: ({ row }) => {
      const score = row.original.aggregate_score;
      let color = "";
      let label = "";

      if (score >= 8) {
        color = "bg-emerald-500";
        label = "Strong Buy";
      } else if (score >= 6) {
        color = "bg-green-500";
        label = "Buy";
      } else if (score >= 4) {
        color = "bg-yellow-500";
        label = "Hold";
      } else if (score >= 2) {
        color = "bg-red-500";
        label = "Sell";
      } else {
        color = "bg-red-700";
        label = "Strong Sell";
      }

      return (
        <div className="flex items-center gap-2">
          <div
            className={`w-3 h-3 rounded-full ${color} ring-2 ring-offset-2 ring-offset-background ${color.replace(
              "bg-",
              "ring-"
            )}`}
          />
          <span className="text-sm font-medium">{label}</span>
        </div>
      );
    },
  }),
] as const;

const TradingSignalsTable: React.FC<Props> = ({ data }) => {
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

  const toggleRow = (rowId: string) => {
    setExpandedRows((prev) => ({ ...prev, [rowId]: !prev[rowId] }));
  };

  const table = useReactTable({
    data,
    columns: [...columns] as ColumnDef<TradingSignal, any>[],
    getCoreRowModel: getCoreRowModel(),
    meta: { toggleRow, expandedRows },
  });

  return (
    <div className="w-full">
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
                    {expandedRows[row.id] &&
                      row.original.company_peers.length > 0 && (
                        <TableRow>
                          <TableCell
                            colSpan={columns.length}
                            className="p-4 bg-slate-50 dark:bg-slate-900"
                          >
                            <div className="space-y-3">
                              <div className="flex items-center gap-2">
                                <div className="h-4 w-1 bg-blue-500 rounded-full" />
                                <span className="font-semibold text-sm">
                                  Related Companies
                                </span>
                              </div>
                              <div className="flex flex-wrap gap-2 pl-6">
                                {row.original.company_peers.map((peer) => (
                                  <a
                                    key={peer.company_symbol}
                                    href={peer.company_link}
                                    className="inline-flex items-center px-3 py-1 rounded-full 
                bg-blue-100 dark:bg-blue-900 
                text-blue-700 dark:text-blue-300 
                text-sm hover:bg-blue-200 dark:hover:bg-blue-800 
                transition-colors"
                                  >
                                    <span className="font-medium">
                                      {peer.company_symbol}
                                    </span>
                                    <span className="mx-1">-</span>
                                    <span>{peer.company_name}</span>
                                  </a>
                                ))}
                              </div>
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
        </div>
      </SkeletonWrapper>
    </div>
  );
};

export default TradingSignalsTable;
