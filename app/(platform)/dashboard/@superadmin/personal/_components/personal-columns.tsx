"use client";

import { DataTableColumnHeader } from "@/components/common/table/column-header";
import { cn, formatPrice, getRoleClassNames, getRoleLabel } from "@/lib/utils";
import type { ColumnDef } from "@tanstack/react-table";
import { Users } from "../page";
import { Badge } from "@/components/ui/badge";

export const columns: ColumnDef<Users>[] = [
  {
    accessorKey: "name",
    id: "Nombre",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nombre" />
    ),
    cell: ({ row }) => {
      const name = row.original.first_name + " " + row.original.last_name;

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
      const phone = row.original.phone_number!;

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
    accessorKey: "role",
    id: "Rol",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Rol" />
    ),
    cell: ({ row }) => {
      const role = row.original.role;

      return (
        <div className="flex items-center gap-2">
          <Badge
            variant={"secondary"}
            className={cn("truncate", getRoleClassNames(role!))}
          >
            {getRoleLabel(role!)}
          </Badge>
        </div>
      );
    },
    size: 80,
    minSize: 80,
    maxSize: 80,
  },
];
