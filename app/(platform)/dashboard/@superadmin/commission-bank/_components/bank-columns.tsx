"use client";

import type { ColumnFilterMeta } from "@/components/common/table/column-filters";
import { DataTableColumnHeader } from "@/components/common/table/column-header";
import { cn, formatPrice } from "@/lib/utils";
import type { ColumnDef } from "@tanstack/react-table";
import { formatInTimeZone } from "date-fns-tz";
import { es } from "date-fns/locale";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown
} from "lucide-react";
import { Transaction } from "../page";

const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

export const columns: ColumnDef<Transaction>[] = [
  {
    accessorKey: "created_at",
    id: "Fecha",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Fecha" />
    ),
    cell: ({ row }) => {
      const date = row.original.created_at!;

      return (
        <div className="flex items-center gap-2">
          <p className="truncate">
            {formatInTimeZone(date, timeZone, "dd/MM/yyyy hh:mm:ss aa", {
              locale: es,
            })}
          </p>
        </div>
      );
    },
    size: 80,
    minSize: 60,
    maxSize: 200,
  },
  {
    accessorKey: "reference",
    id: "Referencia",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Referencia" />
    ),
    cell: ({ row }) => {
      const reference = row.original.reference;

      return (
        <div className="flex items-center gap-2">
          <p className="truncate">{reference}</p>
        </div>
      );
    },
    size: 80,
    minSize: 60,
    maxSize: 200,
  },
  {
    accessorKey: "amount",
    id: "Sector",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Monto" />
    ),
    cell: ({ row }) => {
      const amount = row.original.amount;

      return (
        <div className="flex items-center gap-2">
          <p
            className={cn(
              "truncate font-semibold",
              row.original.type === "income"
                ? "text-success"
                : "text-destructive"
            )}
          >
            MXN {formatPrice(amount!)}
          </p>
        </div>
      );
    },
    size: 100,
    minSize: 80,
    maxSize: 120,
  },
  {
    accessorKey: "type",
    id: "Tipo",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tipo" />
    ),
    cell: ({ row }) => {
      const type = row.original.type;

      return (
        <div className="flex items-center gap-2">
          <kbd
            className={cn(
              "bg-background inline-flex h-5 items-center rounded border px-1 font-mono text-[10px] font-medium shrink-0",
              type === "income"
                ? "text-success bg-success/10"
                : "text-destructive bg-destructive/10"
            )}
          >
            {type === "income" ? "Ingreso" : "Egreso"}
          </kbd>
        </div>
      );
    },
    size: 80,
    minSize: 60,
    maxSize: 100,
    meta: {
      filterOptions: [
        {
          label: "Ingresos",
          value: "income",
          icon: ArrowUp,
        },
        {
          label: "Egresos",
          value: "outcome",
          icon: ArrowDown,
        },
      ],
      filterVariant: "select",
      label: "Tipo",
      icon: ArrowUpDown,
      placeholder: "Buscar tipo",
    } as ColumnFilterMeta,
  },
  {
    accessorKey: "description",
    id: "Descripción",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Descripción" />
    ),
    enableSorting: false,
    cell: ({ row }) => {
      const description = row.original.description;

      return (
        <div className="flex items-center gap-2">
          <p className="truncate">{description}</p>
        </div>
      );
    },
    size: 280,
    minSize: 260,
    maxSize: 300,
  },
];
