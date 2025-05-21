"use client";

import { DataTableColumnHeader } from "@/components/common/table/column-header";
import type { ColumnDef } from "@tanstack/react-table";
import { Withdrawal } from "../page";
import { formatInTimeZone } from "date-fns-tz";
import { differenceInDays } from "date-fns";
import { createSafeAccessor, formatPrice } from "@/lib/utils";
import { WithdrawalSheetActions } from "./withdrawal-sheet-actions";

const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

export const columns: ColumnDef<Withdrawal>[] = [
  {
    accessorKey: "reference",
    id: "Referencia",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Referencia" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          <p className="truncate">{row.original.reference}</p>
        </div>
      );
    },
    size: 60,
    minSize: 60,
    maxSize: 60,
  },
  {
    accessorKey: "created_at",
    id: "Fecha",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Fecha" />
    ),
    cell: ({ row }) => {
      const created_at = row.original.created_at;

      return (
        <div className="flex items-center gap-2">
          <p className="truncate">
            {formatInTimeZone(created_at, timeZone, "dd/MM/yyyy hh:mm:ss a")},
            hace {differenceInDays(new Date(), new Date(created_at))} días
          </p>
        </div>
      );
    },
    size: 150,
    minSize: 120,
    maxSize: 180,
  },
  {
    accessorKey: "amount",
    id: "Monto",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Monto" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          <p className="truncate">{formatPrice(row.original.amount)}</p>
        </div>
      );
    },
    size: 80,
    minSize: 80,
    maxSize: 80,
  },
  {
    accessorKey: "user_received_amount",
    id: "Monto a usuario",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Monto a usuario" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          <p className="truncate">
            {formatPrice(row.original.user_received_amount || 0)}
          </p>
        </div>
      );
    },
    size: 80,
    minSize: 80,
    maxSize: 80,
  },
  {
    accessorKey: "knoott_received_amount",
    id: "Monto a KCA",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Monto a KCA" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          <p className="truncate">
            {formatPrice(row.original.knoott_received_amount || 0)}
          </p>
        </div>
      );
    },
    size: 80,
    minSize: 80,
    maxSize: 80,
  },
  {
    accessorFn: createSafeAccessor<Withdrawal, string>(
      "user.first_name user.last_name",
      ""
    ),
    id: "Usuario",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Usuario" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          <p className="truncate">
            {row.original.user.first_name} {row.original.user.last_name}
          </p>
        </div>
      );
    },
    size: 120,
    minSize: 120,
    maxSize: 120,
  },
  {
    id: "Acciones",
    enableHiding: false,
    enableSorting: false,
    cell: ({ row }) => {
      return <WithdrawalSheetActions data={row.original} />;
    },
  },
];
