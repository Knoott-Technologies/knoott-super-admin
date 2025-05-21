import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Database } from "@/database.types";
import NumberFlow from "@number-flow/react";

export const TotalTransactionsCard = ({
  business,
  transactions,
}: {
  business: Database["public"]["Tables"]["provider_business"]["Row"];
  transactions:
    | Database["public"]["Tables"]["provider_business_transactions"]["Row"][]
    | null;
}) => {
  const completedTransactions = transactions?.filter(
    (transaction) => transaction.status === "completed"
  );

  const total = completedTransactions?.reduce(
    (acc, transaction) => acc + transaction.amount,
    0
  );
  return (
    <Card className="w-full flex-1 bg-sidebar flex flex-col">
      <CardHeader className="border-b-0 bg-transparent">
        <CardTitle>Transacciones completadas</CardTitle>
        <CardDescription>
          Suma total de las transacciones completadas.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <div className="w-full h-fit flex gap-x-2 items-center justify-between mt-auto">
          <NumberFlow
            format={{
              style: "currency",
              currency: "MXN",
              currencyDisplay: "code",
            }}
            className="text-2xl lg:text-3xl xl:text-4xl font-semibold truncate leading-none"
            value={(total && total / 100) || 0}
          />
        </div>
      </CardContent>
    </Card>
  );
};
