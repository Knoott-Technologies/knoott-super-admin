import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import NumberFlow from "@number-flow/react";
import { ReactNode } from "react";

export const CardCount = ({
  count,
  title,
}: {
  count: number;
  title: string;
}) => {
  return (
    <Card className="flex flex-1 flex-col gap-y-0 items-start justify-start w-full">
      <CardHeader className="w-full shrink-0">
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-y-0 items-start justify-end w-full h-full bg-sidebar">
        <p className="text-2xl lg:text-3xl xl:text-4xl font-semibold">
          {count}
        </p>
      </CardContent>
    </Card>
  );
};

export const AmountCard = ({
  amount,
  title,
  type,
}: {
  amount: number;
  title: string;
  type?: "income" | "expense" | "balance";
}) => {
  return (
    <Card className="w-full flex-1 bg-sidebar flex flex-col">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <div className="w-full h-fit flex gap-x-2 items-center justify-between mt-auto">
          <NumberFlow
            format={{
              style: "currency",
              currency: "MXN",
              currencyDisplay: "code",
            }}
            className={cn(
              "text-2xl lg:text-3xl xl:text-4xl font-semibold truncate leading-none",
              (type === "income" && "text-success") ||
                (type === "expense" && "text-destructive") ||
                "text-foreground"
            )}
            value={(amount && amount / 100) || 0}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export const AmountUnwrappedCard = ({
  amount,
  title,
  type,
  children,
}: {
  amount: number;
  title: string;
  type?: "income" | "expense" | "balance";
  children?: ReactNode;
}) => {
  return (
    <Card className="w-full flex-1 bg-sidebar flex flex-col">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <div className="w-full h-fit flex gap-x-2 items-center justify-between mt-auto">
          <NumberFlow
            format={{
              style: "currency",
              currency: "MXN",
              currencyDisplay: "code",
            }}
            className={cn(
              "text-2xl lg:text-3xl xl:text-4xl font-semibold truncate leading-none",
              (type === "income" && "text-success") ||
                (type === "expense" && "text-destructive") ||
                "text-foreground"
            )}
            value={(amount && amount / 100) || 0}
          />
          {children}
        </div>
      </CardContent>
    </Card>
  );
};
