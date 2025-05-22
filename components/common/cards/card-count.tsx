import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import NumberFlow from "@number-flow/react";
import { Arrow } from "@radix-ui/react-tooltip";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";

export const CardCount = ({
  count,
  title,
  destructive,
  href,
  warning,
}: {
  count: number;
  title: string;
  destructive?: boolean;
  warning?: boolean;
  href?: string;
}) => {
  if (href) {
    return (
      <Link href={href} className="flex-1 w-full flex flex-col">
        <Card
          className={cn(
            "flex flex-1 flex-col gap-y-0 items-start justify-start w-full",
            destructive && "bg-destructive/5 border-destructive/50",
            warning && "border-orange-400"
          )}
        >
          <CardHeader
            className={cn(
              "w-full shrink-0 flex flex-row items-center justify-between gap-x-3 space-y-0",
              destructive && "border-destructive/50",
              warning && "border-orange-400"
            )}
          >
            <CardTitle>{title}</CardTitle>
            <ArrowRight className="!size-3.5 flex-shrink-0" />
          </CardHeader>
          <CardContent
            className={cn(
              "flex flex-col gap-y-0 items-start justify-end w-full h-full bg-sidebar",
              destructive && "bg-destructive/5 text-destructive",
              warning && "bg-orange-50 text-orange-600"
            )}
          >
            <p className={cn("text-2xl lg:text-3xl xl:text-4xl font-semibold")}>
              {count}
            </p>
          </CardContent>
        </Card>
      </Link>
    );
  }

  return (
    <Card
      className={cn(
        "flex flex-1 flex-col gap-y-0 items-start justify-start w-full",
        destructive && "bg-destructive/5 border-destructive/50"
      )}
    >
      <CardHeader
        className={cn(
          "w-full shrink-0",
          destructive && "border-destructive/50"
        )}
      >
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent
        className={cn(
          "flex flex-col gap-y-0 items-start justify-end w-full h-full bg-sidebar",
          destructive && "bg-destructive/5 text-destructive"
        )}
      >
        <p className={cn("text-2xl lg:text-3xl xl:text-4xl font-semibold")}>
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
  href,
}: {
  amount: number;
  title: string;
  type?: "income" | "expense" | "balance";
  href?: string;
}) => {
  if (href) {
    return (
      <Link href={href} className="flex-1 w-full flex flex-col">
        <Card className="w-full flex-1 bg-sidebar flex flex-col">
          <CardHeader className="w-full shrink-0 flex flex-row items-center justify-between gap-x-3 space-y-0">
            <CardTitle>{title}</CardTitle>
            <ArrowRight className="!size-3.5 flex-shrink-0" />
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
      </Link>
    );
  }

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
