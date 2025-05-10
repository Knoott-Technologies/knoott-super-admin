"use client";

import { Table } from "@tanstack/react-table";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect } from "react";

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
  onLoadMore?: () => Promise<void>;
  hasMoreData?: boolean;
  isLoadingMore?: boolean;
  totalCount?: number;
}

export function DataTablePagination<TData>({
  table,
  onLoadMore,
  hasMoreData = false,
  isLoadingMore = false,
  totalCount,
}: DataTablePaginationProps<TData>) {
  // Check if we need to load more data when approaching the end of current data
  useEffect(() => {
    const currentPage = table.getState().pagination.pageIndex;
    const pageCount = table.getPageCount();

    // If we're on the last page or within 2 pages of the last page and there's more data to load
    if (
      onLoadMore &&
      hasMoreData &&
      currentPage >= pageCount - 3 &&
      !isLoadingMore
    ) {
      onLoadMore();
    }
  }, [
    table.getState().pagination.pageIndex,
    table.getPageCount(),
    onLoadMore,
    hasMoreData,
    isLoadingMore,
  ]);

  // Calculate the actual total pages if we know the total count
  const displayedPageCount = totalCount
    ? Math.ceil(totalCount / table.getState().pagination.pageSize)
    : table.getPageCount();

  return (
    <div className="flex items-center justify-between px-2 w-full">
      <div className="flex-1 text-sm text-muted-foreground">
        {table.getFilteredSelectedRowModel().rows.length} de{" "}
        {table.getFilteredRowModel().rows.length} fila(s) seleccionada(s).
        {totalCount && (
          <span className="ml-2">(Total: {totalCount} registros)</span>
        )}
      </div>
      <div className="flex items-center space-x-6 lg:space-x-8">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">Filas por página</p>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 15, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          Pág. {table.getState().pagination.pageIndex + 1} de{" "}
          {displayedPageCount}
          {hasMoreData && "..."}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Ir a la primera pagina</span>
            <ChevronsLeft />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Ir a la pagina anterior</span>
            <ChevronLeft />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage() && !hasMoreData}
          >
            <span className="sr-only">Ir a la pagina siguiente</span>
            <ChevronRight />
            {isLoadingMore && (
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-primary animate-ping"></span>
            )}
          </Button>
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => {
              if (totalCount) {
                table.setPageIndex(displayedPageCount - 1);
              } else {
                table.setPageIndex(table.getPageCount() - 1);
              }
            }}
            disabled={
              (!table.getCanNextPage() && !hasMoreData) || isLoadingMore
            }
          >
            <span className="sr-only">Ir a la última pagina</span>
            <ChevronsRight />
          </Button>
        </div>
      </div>
    </div>
  );
}
