"use client";

import { DataTableColumnHeader } from "@/components/common/table/column-header";
import { formatPrice } from "@/lib/utils";
import type { ColumnDef } from "@tanstack/react-table";
import { Users } from "../page";

export const columns: ColumnDef<Users>[] = [
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
    accessorKey: "email",
    id: "Email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => {
      const email = row.original.email;

      return (
        <div className="flex items-center gap-2">
          <p className="truncate">{email}</p>
        </div>
      );
    },
    size: 150,
    minSize: 120,
    maxSize: 180,
  },
  {
    accessorKey: "phone",
    id: "Teléfono",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Teléfono" />
    ),
    cell: ({ row }) => {
      const phone = row.original.phone!;

      return (
        <div className="flex items-center gap-2">
          <p className="truncate">{phone}</p>
        </div>
      );
    },
    size: 80,
    minSize: 80,
    maxSize: 80,
  },
  {
    accessorKey: "total_contribution_amount",
    id: "Total Contribuido",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Total Contribuido" />
    ),
    cell: ({ row }) => {
      const total_contribution_amount =
        row.original.total_contribution_amount || 0;
      return (
        <div className="flex items-center gap-2">
          <p className="truncate">
            MXN {formatPrice(total_contribution_amount)}
          </p>
        </div>
      );
    },
  },
  {
    accessorKey: "total_contribution",
    id: "Contribuciones",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Contribuciones" />
    ),
    cell: ({ row }) => {
      const totalContribution = row.original.total_contribution || 0;
      return (
        <div className="flex items-center gap-2">
          <p className="truncate">{totalContribution}</p>
        </div>
      );
    },
  },
];
