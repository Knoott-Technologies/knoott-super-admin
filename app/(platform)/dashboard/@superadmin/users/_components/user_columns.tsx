"use client";

import { DataTableColumnHeader } from "@/components/common/table/column-header";
import { Badge } from "@/components/ui/badge";
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
  {
    accessorKey: "ticket_promedio",
    id: "Ticket Promedio",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Ticket Promedio" />
    ),
    cell: ({ row }) => {
      const ticket_promedio = row.original.ticket_promedio || 0;
      return (
        <div className="flex items-center gap-2">
          <p className="truncate">MXN {formatPrice(ticket_promedio)}</p>
        </div>
      );
    },
  },
  {
    id: "Distribución",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Distribución" />
    ),
    cell: ({ row }) => {
      const table = row.original.has_table;
      const provider = row.original.is_provider;
      const guest = row.original.has_gifted;

      return (
        <div className="flex items-center gap-2">
          <div className="flex gap-1 items-center justify-start">
            {guest && (
              <Badge
                variant={"secondary"}
                className="bg-muted text-muted-foreground hover:bg-muted hover:text-muted-foreground"
              >
                Invitado
              </Badge>
            )}
            {table && (
              <Badge
                variant={"secondary"}
                className="bg-primary/20 text-yellow-700 hover:bg-primary/20 hover:text-yellow-700"
              >
                Mesa
              </Badge>
            )}
            {provider && (
              <Badge
                variant={"secondary"}
                className="bg-contrast/10 text-contrast hover:bg-contrast/10 hover:text-contrast"
              >
                Proveedor
              </Badge>
            )}
          </div>
        </div>
      );
    },
  },
];
