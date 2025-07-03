import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Database } from "@/database.types";
import NumberFlow from "@number-flow/react";

export const TotalContributionCard = ({
  wedding,
  transactions,
}: {
  wedding: Database["public"]["Tables"]["weddings"]["Row"];
  transactions: Database["public"]["Tables"]["wedding_transactions"]["Row"][];
}) => {
  const total = transactions.reduce(
    (acc, transaction) => acc + transaction.user_received_amount!,
    0
  );
  return (
    <Card className="w-full flex-1 bg-sidebar flex flex-col">
      <CardHeader className="border-b-0 bg-transparent">
        <CardTitle>Total recibido</CardTitle>
        <CardDescription>Total recibido en tu mesa de regalos.</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <div className="w-full h-fit flex gap-x-2 items-center justify-between mt-auto">
          <NumberFlow
            format={{
              style: "currency",
              currency: "MXN",
              currencyDisplay: "code",
            }}
            className="text-2xl lg:text-3xl font-semibold truncate leading-none"
            value={total / 100 || 0}
          />
        </div>
      </CardContent>
    </Card>
  );
};
