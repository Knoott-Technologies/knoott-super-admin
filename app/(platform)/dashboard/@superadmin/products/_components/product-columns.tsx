"use client";

import type { ColumnFilterMeta } from "@/components/common/table/column-filters";
import { DataTableColumnHeader } from "@/components/common/table/column-header";
import { Badge } from "@/components/ui/badge";
import {
  cn,
  formatPrice,
  getProductStatusClassNames,
  getProductStatusLabel,
} from "@/lib/utils";
import type { ColumnDef } from "@tanstack/react-table";
import { CircleDashed, ListTree, Store, Tag } from "lucide-react";
import { Product } from "../page";

export const columns: ColumnDef<Product>[] = [
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
    accessorKey: "category",
    id: "Categoría",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Categoría" />
    ),
    cell: ({ row }) => {
      const category = row.original.category;

      return (
        <div className="flex items-center gap-2">
          <p className="truncate">{category}</p>
        </div>
      );
    },
    size: 150,
    minSize: 120,
    maxSize: 180,
    meta: {
      placeholder: "Buscar categoría",
      filterVariant: "auto-select",
      label: "Categoría",
      icon: ListTree,
    } as ColumnFilterMeta,
  },
  {
    accessorKey: "brand",
    id: "Marca",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Marca" />
    ),
    cell: ({ row }) => {
      const brand = row.original.brand;

      return (
        <div className="flex items-center gap-2">
          <p className="truncate">{brand}</p>
        </div>
      );
    },
    size: 100,
    minSize: 80,
    maxSize: 120,
    meta: {
      placeholder: "Buscar marca",
      filterVariant: "auto-select",
      label: "Marca",
      icon: Tag,
    } as ColumnFilterMeta,
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
            className={cn("capitalize", getProductStatusClassNames(status))}
          >
            {getProductStatusLabel(status)}
          </Badge>
        </div>
      );
    },
    size: 80,
    minSize: 80,
    maxSize: 80,
    meta: {
      filterVariant: "select",
      label: "Estatus",
      icon: CircleDashed,
      filterOptions: [
        { value: "draft", label: "Borrador" },
        { value: "active", label: "Activo" },
        { value: "deleted", label: "Eliminado" },
        { value: "archived", label: "Archivado" },
        { value: "requires_verification", label: "Requiere verificación" },
      ],
    } as ColumnFilterMeta,
  },
  {
    accessorKey: "price",
    id: "Precio base",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Precio base" />
    ),
    cell: ({ row }) => {
      const price = row.original.price || 0;
      return (
        <div className="flex items-center gap-2">
          <p className="truncate text-success font-semibold">
            MXN {formatPrice(price)}
          </p>
        </div>
      );
    },
    size: 100,
    minSize: 100,
    maxSize: 100,
  },
  {
    accessorKey: "shipping_cost",
    id: "Envío",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Envío" />
    ),
    cell: ({ row }) => {
      const shipping_cost = row.original.shipping_cost || 0;
      return (
        <div className="flex items-center gap-2">
          <p className="truncate text-success font-semibold">
            MXN {formatPrice(shipping_cost)}
          </p>
        </div>
      );
    },
    size: 100,
    minSize: 100,
    maxSize: 100,
  },
  {
    accessorKey: "partner",
    id: "Partner",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Partner" />
    ),
    cell: ({ row }) => {
      const partner = row.original.partner || 0;
      return (
        <div className="flex items-center gap-2">
          <p className={cn("truncate")}>{partner}</p>
        </div>
      );
    },
    size: 100,
    minSize: 100,
    maxSize: 100,
    meta: {
      placeholder: "Buscar partner",
      filterVariant: "auto-select",
      label: "Partner",
      icon: Store,
    } as ColumnFilterMeta,
  },
];
