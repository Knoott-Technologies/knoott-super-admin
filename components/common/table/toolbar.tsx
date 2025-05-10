"use client";

import type { Table } from "@tanstack/react-table";
import { FilterX, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableViewOptions } from "./view-options";
import { ColumnFilterMeta, DataTableColumnFilter } from "./column-filters";

interface DataTableFiltersFromColumnsProps<TData> {
  table: Table<TData>;
  showGlobalFilter?: boolean;
}

export function DataTableFiltersFromColumns<TData>({
  table,
  showGlobalFilter = true,
}: DataTableFiltersFromColumnsProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  // Obtener columnas que tienen opciones de filtro definidas
  const filterableColumns = table.getAllColumns().filter((column) => {
    const meta = column.columnDef.meta as ColumnFilterMeta | undefined;
    if (!meta) return false;

    // Incluir columnas con filterOptions definidas
    if (meta.filterOptions && meta.filterOptions.length > 0) return true;

    // Incluir columnas con filtro auto-select o generateOptionsFromData
    if (meta.filterVariant === "auto-select" || meta.generateOptionsFromData)
      return true;

    // Incluir columnas con filtros de texto o rango
    if (meta.filterVariant === "text" || meta.filterVariant === "range")
      return true;

    return false;
  });

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex flex-wrap items-center justify-between gap-2 w-full">
        {showGlobalFilter && (
          <div className="flex flex-1 items-center space-x-2">
            <Input
              placeholder="Buscar en todas las columnas..."
              value={table.getState().globalFilter ?? ""}
              onChange={(event) => table.setGlobalFilter(event.target.value)}
              className="h-8 w-[250px] lg:w-[300px] bg-sidebar"
            />
            {table.getState().globalFilter && (
              <Button
                variant="ghost"
                onClick={() => table.setGlobalFilter("")}
                className="h-8 px-2 lg:px-3"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Limpiar búsqueda</span>
              </Button>
            )}
          </div>
        )}
        <div className="flex flex-wrap items-center gap-2">
          {/* Mostrar filtros para columnas que tienen opciones definidas */}
          {filterableColumns.map((column) => (
            <DataTableColumnFilter
              key={column.id}
              column={column}
              title={column.columnDef.header as string}
            />
          ))}
          <DataTableViewOptions table={table} />
          {isFiltered && (
            <div className="flex items-center gap-2">
              <Button
                variant="destructive"
                size={"icon"}
                className="size-8"
                onClick={() => table.resetColumnFilters()}
              >
                <FilterX />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
