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
import { DataTableBulkActions } from "./data-table-bulk-actions";
import { Checkbox } from "@/components/ui/checkbox";

interface DataTableProps<TData extends object, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  rowAsLink?: boolean;
  basePath?: string; // Nueva propiedad para la ruta base
  idField?: string; // Nueva propiedad para especificar qué campo usar como ID
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
  // Bulk actions props
  enableRowSelection?: boolean;
  enableBulkActions?: boolean;
  entityType?: string;
  bulkApproveAction?: (
    ids: string[]
  ) => Promise<{ success: boolean; error?: string }>;
  bulkRejectAction?: (
    ids: string[]
  ) => Promise<{ success: boolean; error?: string }>;
}

export function DataTable<TData extends object, TValue>({
  columns,
  data,
  initialState = {},
  rowAsLink = false,
  basePath = "",
  idField = "id",
  onLoadMore,
  hasMoreData = false,
  isLoadingMore = false,
  totalCount,
  enableRowSelection = false,
  enableBulkActions = false,
  entityType,
  bulkApproveAction,
  bulkRejectAction,
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

  // Añadir columna de selección si enableRowSelection es true
  const selectionColumn: ColumnDef<TData, any> = {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        onClick={(e) => e.stopPropagation()}
      />
    ),
    enableSorting: false,
    enableHiding: false,
    size: 40,
  };

  // Añadir columna de selección al principio si enableRowSelection es true
  const tableColumns = enableRowSelection
    ? [selectionColumn, ...columns]
    : columns;

  const table = useReactTable({
    data,
    columns: tableColumns,
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
      <div className="flex flex-col sm:flex-row sm:justify-between w-full gap-4">
        <DataTableFiltersFromColumns table={table} showGlobalFilter={true} />
      </div>
      {enableBulkActions && enableRowSelection && (
          <DataTableBulkActions
            table={table}
            entityType={entityType || ""}
            approveAction={bulkApproveAction}
            rejectAction={bulkRejectAction}
            idField={idField as keyof TData}
            successRedirectPath={basePath}
          />
      )}
      <div className="border bg-sidebar w-full">
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
                if (rowAsLink && !enableRowSelection) {
                  return (
                    <TableRow
                      key={row.id}
                      onClick={() => {
                        // Verificar si el campo especificado existe en el objeto original
                        let idValue: string | undefined;

                        if (idField in row.original) {
                          // Si el campo especificado existe, usarlo
                          idValue = String(
                            row.original[idField as keyof typeof row.original]
                          );
                        } else if ("id" in row.original) {
                          // Si no existe el campo especificado pero existe 'id', usar 'id'
                          idValue = String((row.original as any).id);
                        } else {
                          // Si no hay campo ID disponible, usar el índice de la fila como fallback
                          idValue = String(row.index);
                          console.warn(
                            `No se encontró el campo '${idField}' ni 'id' en los datos de la fila. Usando índice de fila como fallback.`
                          );
                        }

                        // Construir la ruta completa
                        const path = basePath
                          ? `${basePath}/${idValue}`.replace(/\/+/g, "/") // Evitar dobles barras
                          : idValue;

                        router.push(path);
                      }}
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

                // Si enableRowSelection es true, permitir selección y navegación
                const handleRowClick = () => {
                  if (!rowAsLink) return;

                  // Verificar si el campo especificado existe en el objeto original
                  let idValue: string | undefined;

                  if (idField in row.original) {
                    // Si el campo especificado existe, usarlo
                    idValue = String(
                      row.original[idField as keyof typeof row.original]
                    );
                  } else if ("id" in row.original) {
                    // Si no existe el campo especificado pero existe 'id', usar 'id'
                    idValue = String((row.original as any).id);
                  } else {
                    // Si no hay campo ID disponible, usar el índice de la fila como fallback
                    idValue = String(row.index);
                    console.warn(
                      `No se encontró el campo '${idField}' ni 'id' en los datos de la fila. Usando índice de fila como fallback.`
                    );
                  }

                  // Construir la ruta completa
                  const path = basePath
                    ? `${basePath}/${idValue}`.replace(/\/+/g, "/") // Evitar dobles barras
                    : idValue;

                  router.push(path);
                };

                return (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className={
                      rowAsLink ? "!cursor-pointer hover:bg-muted/50" : ""
                    }
                    onClick={rowAsLink ? handleRowClick : undefined}
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
                  colSpan={columns.length + (enableRowSelection ? 1 : 0)}
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
