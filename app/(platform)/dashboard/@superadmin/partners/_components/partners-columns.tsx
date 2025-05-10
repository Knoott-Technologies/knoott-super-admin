"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { cn, formatPrice } from "@/lib/utils";
import { DataTableColumnHeader } from "@/components/common/table/column-header";
import type { ColumnFilterMeta } from "@/components/common/table/column-filters";
import { CircleDashed, ListTree } from "lucide-react";
import { Partners } from "../page";

export const columns: ColumnDef<Partners>[] = [
  {
    accessorKey: "name",
    id: "Nombre",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nombre" />
    ),
    cell: ({ row }) => {
      const name = row.original.name;

      return (
        <div className="flex items-center gap-2">
          <p className="truncate">{name}</p>
        </div>
      );
    },
    size: 150,
    minSize: 120,
    maxSize: 180,
  },
  {
    accessorKey: "sector",
    id: "Sector",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Sector" />
    ),
    cell: ({ row }) => {
      const sector = row.original.sector;

      return (
        <div className="flex items-center gap-2">
          <p className="truncate">{sector}</p>
        </div>
      );
    },
    size: 150,
    minSize: 120,
    maxSize: 180,
    meta: {
      placeholder: "Buscar por sector",
      filterVariant: "auto-select",
      label: "Sector",
      icon: ListTree,
    } as ColumnFilterMeta,
  },
  {
    accessorKey: "status",
    id: "Estatus",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Estatus" />
    ),
    cell: ({ row }) => {
      const status = row.original.status!;

      return (
        <div className="flex items-center gap-2">
          <Badge
            variant={"secondary"}
            className={cn(
              "capitalize",
              (status &&
                "bg-success/10 text-success hover:bg-success/10 hover:text-success") ||
                "bg-destructive/10 text-destructive hover:bg-destructive/10 hover:text-destructive"
            )}
          >
            {(status && "Verificado") || "No verificado"}
          </Badge>
        </div>
      );
    },
    size: 80,
    minSize: 80,
    maxSize: 80,
    meta: {
      filterVariant: "select",
      label: "Estatus",
      icon: CircleDashed,
      filterOptions: [
        { value: true, label: "Verificado" },
        { value: false, label: "No verificado" },
      ],
    } as ColumnFilterMeta,
  },
  {
    accessorKey: "total_active_products",
    id: "Productos Activos",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Productos Activos" />
    ),
    cell: ({ row }) => {
      const totalActiveProducts = row.original.total_active_products || 0;
      return (
        <div className="flex items-center gap-2">
          <p className="truncate">{totalActiveProducts}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "total_in_sales",
    id: "Total Ventas ($)",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Total Ventas ($)" />
    ),
    cell: ({ row }) => {
      const totalSales = row.original.total_in_sales || 0;
      return (
        <div className="flex items-center gap-2">
          <p className="truncate text-success font-semibold">
            MXN {formatPrice(totalSales)}
          </p>
        </div>
      );
    },
  },
  {
    accessorKey: "total_sales",
    id: "Ventas",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Ventas" />
    ),
    cell: ({ row }) => {
      const totalSales = row.original.total_in_sales || 0;
      return (
        <div className="flex items-center gap-2">
          <p className="truncate">{totalSales}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "total_pending_sales",
    id: "Por confirmar",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Por confirmar" />
    ),
    cell: ({ row }) => {
      const totalPendingSales = row.original.total_pending_sales || 0;
      return (
        <div className="flex items-center gap-2">
          <p
            className={cn(
              "truncate",
              totalPendingSales > 0 && "text-destructive" || "text-success"
            )}
          >
            {totalPendingSales}
          </p>
        </div>
      );
    },
  },
];
