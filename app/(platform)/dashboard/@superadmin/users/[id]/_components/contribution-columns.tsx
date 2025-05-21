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
  {
    accessorKey: "metadata",
    id: "Metadatos",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Metadatos" />
    ),
    cell: ({ row }) => {
      // Asegurarse de que metadata sea un objeto
      const metadata =
        typeof row.original.metadata === "string"
          ? JSON.parse(row.original.metadata)
          : row.original.metadata;

      // Crear una versión resumida para el preview
      const previewText = metadata
        ? Object.keys(metadata)
            .slice(0, 2)
            .map(
              (key) =>
                `${key}: ${JSON.stringify(metadata[key]).substring(0, 15)}`
            )
            .join(", ") + (Object.keys(metadata).length > 2 ? "..." : "")
        : "Sin metadatos";

      // Formatear el JSON completo para el tooltip
      const fullMetadata = metadata
        ? JSON.stringify(metadata, null, 2)
        : "Sin metadatos";

      return (
        <div className="flex items-center gap-2">
          <p className="truncate">{previewText}</p>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="inline-flex items-center justify-center rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground">
                  <Info className="h-4 w-4" />
                  <span className="sr-only">Ver metadatos completos</span>
                </button>
              </TooltipTrigger>
              <TooltipContent side="right" className="max-w-md bg-background">
                <pre className="text-xs overflow-auto max-h-[300px] p-2">
                  {fullMetadata}
                </pre>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      );
    },
    size: 120,
    minSize: 100,
    maxSize: 140,
  },
];
