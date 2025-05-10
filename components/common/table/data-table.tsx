"use client";

import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  type SortingState,
  getSortedRowModel,
  type VisibilityState,
  getFilteredRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  type ColumnFiltersState,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DataTablePagination } from "./pagination";
import { useState } from "react";
import { DataTableFiltersFromColumns } from "./toolbar";
import { useRouter } from "next/navigation";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  rowAsLink?: boolean;
  initialState?: {
    sorting?: SortingState;
    columnVisibility?: VisibilityState;
    columnFilters?: ColumnFiltersState;
    pagination?: {
      pageIndex?: number;
      pageSize?: number;
    };
  };
  // New props for infinite pagination
  onLoadMore?: () => Promise<void>;
  hasMoreData?: boolean;
  isLoadingMore?: boolean;
  totalCount?: number;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  initialState = {},
  rowAsLink = false,
  onLoadMore,
  hasMoreData = false,
  isLoadingMore = false,
  totalCount,
}: DataTableProps<TData, TValue>) {
  const router = useRouter();

  const [sorting, setSorting] = useState<SortingState>(
    initialState.sorting || []
  );
  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    initialState.columnVisibility || {}
  );
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
    initialState.columnFilters || []
  );
  const [globalFilter, setGlobalFilter] = useState<string>("");

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    state: {
      sorting,
      rowSelection,
      columnVisibility,
      columnFilters,
      globalFilter,
    },
    initialState: {
      pagination: {
        pageSize: initialState.pagination?.pageSize || 15,
        pageIndex: initialState.pagination?.pageIndex || 0,
      },
    },
    // Habilitar el filtrado global
    globalFilterFn: (row, columnId, value) => {
      const searchValue = String(value).toLowerCase();
      const cellValue = String(row.getValue(columnId) || "").toLowerCase();
      return cellValue.includes(searchValue);
    },
  });

  return (
    <section className="flex flex-col gap-y-4 items-start justify-start w-full">
      <DataTableFiltersFromColumns table={table} showGlobalFilter={true} />
      <div className="rounded-md border bg-sidebar w-full">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => {
                if (rowAsLink) {
                  return (
                    <TableRow
                      key={row.id}
                      //   @ts-expect-error - Type 'string | number' is not assignable to type 'never'.
                      onClick={() => router.push(row.original.id)}
                      data-state={row.getIsSelected() && "selected"}
                      className="!cursor-pointer hover:bg-muted/50"
                    >
                      {row.getVisibleCells().map((cell) => {
                        const maxWidth = cell.column.columnDef.maxSize;
                        const minWidth = cell.column.columnDef.minSize;
                        const width = cell.column.getSize();

                        return (
                          <TableCell
                            style={{ maxWidth, minWidth, width }}
                            key={cell.id}
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                }

                return (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => {
                      const maxWidth = cell.column.columnDef.maxSize;
                      const minWidth = cell.column.columnDef.minSize;
                      const width = cell.column.getSize();

                      return (
                        <TableCell
                          style={{ maxWidth, minWidth, width }}
                          key={cell.id}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  {isLoadingMore ? "Cargando más datos..." : "Sin resultados"}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination
        table={table}
        onLoadMore={onLoadMore}
        hasMoreData={hasMoreData}
        isLoadingMore={isLoadingMore}
        totalCount={totalCount}
      />
    </section>
  );
}
