import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Database } from "@/database.types";
import { cn } from "@/lib/utils";
import NumberFlow from "@number-flow/react";

export const KnoottCardCash = ({
  wedding,
}: {
  wedding: Database["public"]["Tables"]["weddings"]["Row"];
}) => {
  return (
      <Card className="w-full flex-1 bg-foreground/5 border-foreground/50 flex flex-col">
        <CardHeader className="border-b-0 bg-transparent">
            <CardTitle>
              Knoott <span className={cn("italic")}>Cash</span>
            </CardTitle>
            <CardDescription>Balance disponible en tu cartera.</CardDescription>
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
              value={(wedding.balance && wedding.balance / 100) || 0}
            />
          </div>
        </CardContent>
      </Card>
  );
};
