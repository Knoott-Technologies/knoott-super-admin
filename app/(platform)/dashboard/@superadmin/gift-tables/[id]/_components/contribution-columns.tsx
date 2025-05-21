"use client";

import { ContributionMessage } from "@/components/common/contribution-message";
import { Database } from "@/database.types";
import { formatPrice } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { formatInTimeZone } from "date-fns-tz";
import { es } from "date-fns/locale";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Transaction =
  Database["public"]["Tables"]["wedding_transactions"]["Row"] & {
    user: Database["public"]["Tables"]["users"]["Row"];
    cart: Database["public"]["Tables"]["user_carts"]["Row"] & {
      items: Database["public"]["Tables"]["cart_items"]["Row"][];
    };
  };

const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

export const columns: ColumnDef<Transaction>[] = [
  {
    id: "Invitado",
    accessorKey: "user.first_name user.last_name",
    header: "Nombre",
    minSize: 200, // Suficiente espacio para nombres completos
    cell: (info) => {
      return (
        <div>
          {info.row.original.user.first_name} {info.row.original.user.last_name}
        </div>
      );
    },
  },
  {
    id: "Mensaje",
    accessorKey: "cart.message",
    header: "Mensaje",
    minSize: 150, // Espacio para números telefónicos
    cell: (info) => {
      if (
        info.row.original.cart.message &&
        info.row.original.cart.message !== ""
      ) {
        return <ContributionMessage data={info.row.original} />;
      }

      return <span className="text-muted-foreground">Sin mensaje</span>;
    },
  },
  {
    id: "Monto",
    accessorKey: "user_received_amount",
    header: "Total Contribuido",
    minSize: 150, // Espacio para cantidades con formato
    cell: (info) => {
      return <div>MXN {formatPrice(info.getValue() as number)}</div>;
    },
  },
  {
    id: "Fecha",
    accessorKey: "created_at",
    header: "Fecha",
    minSize: 180, // Ancho mínimo para mostrar la fecha con formato
    cell: (info) => {
      return (
        <div>
          {formatInTimeZone(
            new Date(info.row.original.created_at),
            timeZone,
            "PPP",
            { locale: es }
          )}
        </div>
      );
    },
  },
];
