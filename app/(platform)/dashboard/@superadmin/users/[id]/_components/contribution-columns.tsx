"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/common/table/column-header";
import { Contributions } from "../page";
import { formatInTimeZone } from "date-fns-tz";
import { es } from "date-fns/locale";
import {
  cn,
  createSafeAccessor,
  formatPrice,
  getPaymentIntentStatusClassname,
  getPaymentIntentStatusLabel,
} from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";

const tiemeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

export const columns: ColumnDef<Contributions>[] = [
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
            {formatInTimeZone(created_at, tiemeZone, "dd/MM/yyyy HH:mm ss aa", {
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
    accessorKey: "amount",
    id: "Monto",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Monto" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          <p className="truncate">MXN {formatPrice(row.original.amount)}</p>
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
      return (
        <div className="flex items-center gap-2">
          <Badge
            variant={"secondary"}
            className={cn(
              "capitalize",
              getPaymentIntentStatusClassname(row.original.status as any)
            )}
          >
            {getPaymentIntentStatusLabel(row.original.status as any)}
          </Badge>
        </div>
      );
    },
    size: 150,
    minSize: 120,
    maxSize: 180,
  },
  {
    accessorKey: "description",
    id: "Descripción",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Descripción" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          <p className="truncate">{row.original.description}</p>
        </div>
      );
    },
    size: 300,
    minSize: 250,
    maxSize: 320,
  },
  {
    accessorFn: createSafeAccessor<Contributions, string>("wedding.city", ""),
    id: "Lugar de la boda",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Lugar de la boda" />
    ),
    cell: ({ row }) => {
      if (!row.original.wedding) {
        return (
          <div className="flex items-center gap-2">
            <p className="truncate">No disponible</p>
          </div>
        );
      }

      const place =
        row.original.wedding.city + ", " + row.original.wedding.state;

      return (
        <div className="flex items-center gap-2">
          <p className="truncate">{place}</p>
        </div>
      );
    },
    size: 150,
    minSize: 120,
    maxSize: 180,
  },
];
