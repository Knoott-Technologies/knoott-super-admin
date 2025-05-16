"use client";

import type { ColumnFilterMeta } from "@/components/common/table/column-filters";
import { DataTableColumnHeader } from "@/components/common/table/column-header";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ColumnDef } from "@tanstack/react-table";
import { CircleDashed } from "lucide-react";
import { Brand } from "../page";
import Image from "next/image";
import { formatInTimeZone } from "date-fns-tz";
import { es } from "date-fns/locale";

const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

export const columns: ColumnDef<Brand>[] = [
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
    size: 300,
    minSize: 320,
    maxSize: 280,
  },
  {
    accessorKey: "created_at",
    id: "Creado",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Creado" />
    ),
    cell: ({ row }) => {
      const created_at = row.original.created_at!;

      return (
        <div className="flex items-center gap-2">
          <p className="truncate">
            {formatInTimeZone(created_at, timeZone, "dd/MM/yyyy HH:mm:ss a", {
              locale: es,
            })}
          </p>
        </div>
      );
    },
    size: 150,
    minSize: 120,
    maxSize: 180,
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
              (status === "active" &&
                "bg-success/10 text-success hover:bg-success/10 hover:text-success") ||
                "bg-contrast/10 text-contrast hover:bg-contrast/10 hover:text-contrast"
            )}
          >
            {status === "active" ? "Activo" : "Por verificar"}
          </Badge>
        </div>
      );
    },
    size: 100,
    minSize: 80,
    maxSize: 120,
    meta: {
      filterVariant: "select",
      label: "Estatus",
      icon: CircleDashed,
      filterOptions: [
        { value: "active", label: "Verificado" },
        { value: "on_revision", label: "Por verificar" },
      ],
    } as ColumnFilterMeta,
  },
];
