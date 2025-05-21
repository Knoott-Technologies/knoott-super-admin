"use client";

import { DataTableColumnHeader } from "@/components/common/table/column-header";
import type { ColumnDef } from "@tanstack/react-table";
import { formatInTimeZone } from "date-fns-tz";
import { differenceInDays } from "date-fns";
import { createSafeAccessor, formatPrice } from "@/lib/utils";
import { PartnerPaymentsActions } from "./partner-payments-actions";
import { PartnerPayment } from "../page";

const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

export const columns: ColumnDef<PartnerPayment>[] = [
  {
    accessorKey: "verified_at",
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
          <p className="truncate">{formatPrice(row.original.total_amount)}</p>
        </div>
      );
    },
    size: 80,
    minSize: 80,
    maxSize: 80,
  },
  {
    accessorKey: "user_received_amount",
    id: "Monto a partner",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Monto a partner" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          <p className="truncate">
            {formatPrice(row.original.povider_received_amount || 0)}
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
    id: "Acciones",
    enableHiding: false,
    enableSorting: false,
    cell: ({ row }) => {
      return <PartnerPaymentsActions data={row.original} />;
    },
  },
];
