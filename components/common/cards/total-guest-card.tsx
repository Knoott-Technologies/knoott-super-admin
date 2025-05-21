import { Transaction } from "@/app/(platform)/dashboard/@superadmin/gift-tables/[id]/_components/contribution-columns";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Database } from "@/database.types";
import NumberFlow from "@number-flow/react";

export const TotalGuestsCard = ({
  transactions,
  wedding,
}: {
  transactions: Transaction[];
  wedding: Database["public"]["Tables"]["weddings"]["Row"];
}) => {
  // Filtrar transacciones que tienen información de usuario válida
  const validTransactions = transactions.filter(
    (transaction) => transaction.user && transaction.user.id
  );

  // Crear un Set de IDs de usuario únicos
  const uniqueUserIds = new Set(
    validTransactions.map((transaction) => transaction.user.id)
  );

  // Obtener el total de contribuyentes únicos
  const totalContribuyentes = uniqueUserIds.size;

  return (
      <Card className="w-full flex-1 bg-sidebar flex flex-col">
        <CardHeader className="border-b-0 bg-transparent">
            <CardTitle>Contribuyentes</CardTitle>
            <CardDescription>
              Total de invitados que han contribuido.
            </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col">
          <div className="w-full h-fit flex gap-x-2 items-center justify-between mt-auto">
            <NumberFlow
              className="text-2xl lg:text-3xl font-semibold truncate leading-none"
              value={totalContribuyentes}
            />
          </div>
        </CardContent>
      </Card>
  );
};
