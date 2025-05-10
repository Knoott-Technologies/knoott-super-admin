"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import {
  cn,
  formatPrice,
  getGiftTableStatusClassNames,
  getGiftTableStatusLabel,
} from "@/lib/utils";
import type { GiftTable } from "../page";
import { DataTableColumnHeader } from "@/components/common/table/column-header";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import type { ColumnFilterMeta } from "@/components/common/table/column-filters";
import { CircleDashed, PieChart } from "lucide-react";

export const columns: ColumnDef<GiftTable>[] = [
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
    accessorKey: "wedding_date",
    id: "Fecha de boda",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Fecha de boda" />
    ),
    cell: ({ row }) => {
      const weddingDate = row.original.wedding_date || "";
      const formattedDate = format(weddingDate, "dd/MM/yyyy", { locale: es });

      return (
        <div className="flex items-center gap-2">
          <p className="truncate">{formattedDate}</p>
        </div>
      );
    },
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
            className={cn("capitalize", getGiftTableStatusClassNames(status))}
          >
            {getGiftTableStatusLabel(status)}
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
        { value: "active", label: "Activa" },
        { value: "paused", label: "Pausada" },
        { value: "closed", label: "Cerrada" },
      ],
    } as ColumnFilterMeta,
  },
  {
    accessorKey: "total_income",
    id: "Total Recibido",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Total Recibido" />
    ),
    cell: ({ row }) => {
      const income = row.original.total_income || 0;
      return (
        <div className="flex items-center gap-2">
          <p className="truncate text-success font-semibold">
            MXN {formatPrice(income)}
          </p>
        </div>
      );
    },
    size: 150,
    minSize: 120,
    maxSize: 180,
  },
  {
    accessorKey: "balance",
    id: "Balance",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Balance" />
    ),
    cell: ({ row }) => {
      const balance = row.original.balance || 0;
      const totalIncome = row.original.total_income || 1; // Prevent division by zero

      // Calculate what percentage of total income the balance represents
      // Ensure we're calculating based on the actual total income
      const balancePercentage = Math.min(
        100,
        Math.max(0, (balance / totalIncome) * 100)
      );

      return (
        <div className="flex items-center gap-2 justify-between w-full">
          <p className="truncate text-foreground">
            MXN {formatPrice(balance)}{" "}
          </p>
          <kbd
            className={cn(
              "bg-background ml-2 inline-flex h-5 items-center rounded border px-1 font-mono text-[10px] font-medium shrink-0",
              balancePercentage > 60
                ? "text-green-600"
                : balancePercentage > 40
                ? "text-green-500"
                : balancePercentage > 20
                ? "text-amber-500"
                : "text-red-500"
            )}
          >
            {balancePercentage.toFixed(0)}%
          </kbd>
        </div>
      );
    },
    size: 150,
    minSize: 120,
    maxSize: 180,
  },
  {
    accessorKey: "total_purchases",
    id: "Total Comprado",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Total Comprado" />
    ),
    cell: ({ row }) => {
      const purchases = row.original.total_purchases || 0;
      const totalIncome = row.original.total_income || 1; // Prevent division by zero

      // Calculate what percentage of total income the purchases represent
      // Ensure we're calculating based on the actual total income
      const purchasesPercentage = Math.min(
        100,
        Math.max(0, (purchases / totalIncome) * 100)
      );

      return (
        <div className="flex items-center gap-2 w-full justify-between">
          <p className="truncate text-destructive">
            MXN {formatPrice(purchases)}{" "}
          </p>
          <kbd
            className={cn(
              "bg-background ml-2 inline-flex h-5 items-center rounded border px-1 font-mono text-[10px] font-medium shrink-0",
              purchasesPercentage > 60
                ? "text-red-600"
                : purchasesPercentage > 40
                ? "text-red-500"
                : purchasesPercentage > 20
                ? "text-amber-500"
                : "text-green-500"
            )}
          >
            {purchasesPercentage.toFixed(0)}%
          </kbd>
        </div>
      );
    },
    size: 150,
    minSize: 120,
    maxSize: 180,
  },
  {
    accessorKey: "total_withdrawal",
    id: "Total Retirado",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Total Retirado" />
    ),
    cell: ({ row }) => {
      const withdrawal = row.original.total_withdrawal || 0;
      const totalIncome = row.original.total_income || 1; // Prevent division by zero

      // Calculate what percentage of total income the withdrawals represent
      // Ensure we're calculating based on the actual total income
      const withdrawalPercentage = Math.min(
        100,
        Math.max(0, (withdrawal / totalIncome) * 100)
      );

      return (
        <div className="flex items-center gap-2 justify-between w-full">
          <p className="truncate text-destructive">
            MXN {formatPrice(withdrawal)}{" "}
          </p>
          <kbd
            className={cn(
              "bg-background ml-2 inline-flex h-5 items-center rounded border px-1 font-mono text-[10px] font-medium shrink-0",
              withdrawalPercentage > 60
                ? "text-red-600"
                : withdrawalPercentage > 40
                ? "text-red-500"
                : withdrawalPercentage > 20
                ? "text-amber-500"
                : "text-green-500"
            )}
          >
            {withdrawalPercentage.toFixed(0)}%
          </kbd>
        </div>
      );
    },
    size: 150,
    minSize: 120,
    maxSize: 180,
  },
  {
    accessorKey: "total_contribution_count",
    id: "Núm.",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Núm." />
    ),
    cell: ({ row }) => {
      const count = row.original.total_contribution_count || 0;
      return (
        <div className="flex items-center gap-2">
          <kbd className="bg-background text-foreground ml-2 inline-flex h-5 items-center rounded border px-1 font-mono text-[10px] font-medium shrink-0">
            {count}
          </kbd>
        </div>
      );
    },
    size: 100,
    minSize: 100,
    maxSize: 100,
  },
];
