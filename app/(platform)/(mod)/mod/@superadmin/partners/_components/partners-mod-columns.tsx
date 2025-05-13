"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { createSafeAccessor } from "@/lib/utils";
import { DataTableColumnHeader } from "@/components/common/table/column-header";
import { ColumnFilterMeta } from "@/components/common/table/column-filters";
import { IdCard } from "lucide-react";
import { formatInTimeZone } from "date-fns-tz";
import { es } from "date-fns/locale";
import { Partners } from "../page";
import Link from "next/link";

const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

export const columns: ColumnDef<Partners>[] = [
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
              new Date(row.original.created_at),
              timeZone,
              "dd/MM/yyyy HH:mm:ss a",
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
    accessorKey: "business_name",
    id: "Nombre",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nombre" />
    ),
    cell: ({ row }) => {
      return (
        <div className="w-full">
          <p className="truncate">{row.original.business_name}</p>
        </div>
      );
    },
    size: 100,
    minSize: 100,
    maxSize: 100,
  },
  {
    accessorKey: "business_legal_name",
    id: "Razón Social",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Razón Social" />
    ),
    cell: ({ row }) => {
      return (
        <div className="w-full">
          <p className="truncate">{row.original.business_legal_name}</p>
        </div>
      );
    },
    size: 100,
    minSize: 100,
    maxSize: 100,
  },
  {
    accessorKey: "contact_phone_number",
    id: "Telefono",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Telefono" />
    ),
    cell: ({ row }) => {
      return (
        <div className="w-full">
          <p className="truncate">{row.original.contact_phone_number}</p>
        </div>
      );
    },
    size: 100,
    minSize: 100,
    maxSize: 100,
  },
  {
    accessorKey: "main_email",
    id: "Correo",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Correo" />
    ),
    cell: ({ row }) => {
      return (
        <div className="w-full">
          <p className="truncate">{row.original.main_email}</p>
        </div>
      );
    },
    size: 100,
    minSize: 100,
    maxSize: 100,
  },
  {
    accessorKey: "website_url",
    id: "Sitio Web",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Sitio Web" />
    ),
    cell: ({ row }) => {
      if (!row.original.website_url) {
        return (
          <div className="w-full">
            <p className="truncate">N/A</p>
          </div>
        );
      }

      return (
        <div className="w-full">
          <Link
            href={row.original.website_url}
            target="_blank"
            rel="noopener noreferrer"
            className="truncate"
          >
            {row.original.website_url}
          </Link>
        </div>
      );
    },
    size: 100,
    minSize: 100,
    maxSize: 100,
  },
];
