"use client";

import { DataTableColumnHeader } from "@/components/common/table/column-header";
import { cn, getRoleClassNames, getRoleLabel } from "@/lib/utils";
import type { ColumnDef } from "@tanstack/react-table";
import { Users } from "../page";
import { Badge } from "@/components/ui/badge";
import { PersonalActions } from "./actions";

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
    size: 120,
    minSize: 120,
    maxSize: 120,
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
    size: 120,
    minSize: 120,
    maxSize: 120,
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
    size: 120,
    minSize: 120,
    maxSize: 120,
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
    size: 150,
    minSize: 150,
    maxSize: 150,
  },
  {
    id: "actions",
    enableSorting: false,
    enableHiding: false,
    cell: ({ row }) => {
      const role = row.original.role;
      const isSuperAdmin = role === "superadmin";

      if (isSuperAdmin) {
        return null;
      }

      return <PersonalActions data={row.original} />;
    },
    size: 50,
    minSize: 50,
    maxSize: 50,
  },
];
