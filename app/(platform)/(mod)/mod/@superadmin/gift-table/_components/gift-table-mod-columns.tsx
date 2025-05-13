"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { createSafeAccessor } from "@/lib/utils";
import { DataTableColumnHeader } from "@/components/common/table/column-header";
import { WeddingVerify } from "../page";
import { ColumnFilterMeta } from "@/components/common/table/column-filters";
import { IdCard } from "lucide-react";
import { formatInTimeZone } from "date-fns-tz";
import { es } from "date-fns/locale";

const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

export const columns: ColumnDef<WeddingVerify>[] = [
  {
    accessorFn: createSafeAccessor<WeddingVerify, string>("wedding.name", ""),
    id: "Boda",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Boda" />
    ),
    cell: ({ row }) => {
      return (
        <div className="w-full">
          <p className="truncate">{row.original.wedding.name}</p>
        </div>
      );
    },
    size: 100,
    minSize: 100,
    maxSize: 100,
  },
  {
    accessorKey: "created_at",
    id: "Creado",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Creado" />
    ),
    cell: ({ row }) => {
      return (
        <div className="w-full">
          <p className="truncate">
            {formatInTimeZone(
              row.original.created_at,
              timeZone,
              "dd/MM/yyyy HH:mm a",
              { locale: es }
            )}
          </p>
        </div>
      );
    },
    size: 100,
    minSize: 100,
    maxSize: 100,
  },
  {
    accessorKey: "full_name",
    id: "Nombre",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nombre" />
    ),
    cell: ({ row }) => {
      return (
        <div className="w-full">
          <p className="truncate">{row.original.full_name}</p>
        </div>
      );
    },
    size: 100,
    minSize: 100,
    maxSize: 100,
  },
  {
    accessorKey: "document_type",
    id: "Tipo Doc.",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tipo Doc." />
    ),
    cell: ({ row }) => {
      return (
        <div className="w-full">
          <p className="truncate capitalize">{row.original.document_type}</p>
        </div>
      );
    },
    size: 100,
    minSize: 100,
    maxSize: 100,
    meta: {
      filterVariant: "auto-select",
      icon: IdCard,
      placeholder: "Buscar tipo documento",
      label: "Documento",
    } as ColumnFilterMeta,
  },
];
