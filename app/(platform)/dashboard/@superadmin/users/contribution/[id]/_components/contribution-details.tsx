"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Contribution } from "../page";
import { formatInTimeZone } from "date-fns-tz";
import { es } from "date-fns/locale";
import { formatPrice } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

export const ContributionDetails = ({
  contribution,
  payment_intent,
  payment_method,
}: {
  contribution: Contribution;
  payment_intent: any;
  payment_method: any;
}) => {
  const stripeCommission = Math.round(
    contribution.amount * (0.036 * 1.16) + 300 * 1.16
  );

  return (
    <Card className="w-full lg:sticky lg:top-[calc(56px_+_28px)]">
      <CardHeader>
        <CardTitle>Detalles de la contribución</CardTitle>
        <CardDescription>
          Desglose de la contribución realizada por{" "}
          {contribution.user.first_name + " " + contribution.user.last_name} el
          día{" "}
          {formatInTimeZone(
            contribution.created_at,
            timeZone,
            "PPP hh:mm:ss a",
            {
              locale: es,
            }
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="bg-sidebar flex flex-col gap-y-6">
        <div className="w-full h-fit items-start justify-start flex flex-col gap-y-4">
          <span className="w-full h-fit items-start justify-start flex flex-col gap-y-1">
            <p className="text-sm font-semibold">Desglose del pago</p>
            <p className="text-xs text-muted-foreground">
              Este es el desglose del pago, contando comisiones y otros gastos.
            </p>
          </span>
          <div className="w-full flex flex-col">
            <div className="w-full h-fit grid grid-cols-2 gap-4 border-b py-1.5 text-muted-foreground">
              <span className="w-full flex items-center justify-start">
                <p className="text-sm">Subtotal</p>
              </span>
              <span className="w-full flex items-center justify-end text-success font-medium">
                <p className="text-sm">
                  {formatPrice(contribution.amount - stripeCommission)}
                </p>
              </span>
            </div>
            <div className="w-full h-fit grid grid-cols-2 gap-4 border-b py-1.5 text-muted-foreground">
              <span className="w-full flex items-center justify-start">
                <p className="text-sm">Comisión de stripe:</p>
              </span>
              <span className="w-full flex items-center justify-end text-destructive font-medium">
                <p className="text-sm">{formatPrice(stripeCommission)}</p>
              </span>
            </div>
            <div className="w-full h-fit grid grid-cols-2 gap-4 py-1.5">
              <span className="w-full flex items-center justify-start">
                <p className="text-sm font-semibold">Total:</p>
              </span>
              <span className="w-full flex items-center justify-end">
                <p className="text-sm font-semibold">
                  {formatPrice(contribution.amount)}
                </p>
              </span>
            </div>
          </div>
        </div>
        <Separator />
        <div className="w-full h-fit items-start justify-start flex flex-col gap-y-4">
          <span className="w-full h-fit items-start justify-start flex flex-col gap-y-1">
            <p className="text-sm font-semibold">Método de pago</p>
            <p className="text-xs text-muted-foreground">
              Método de pago utilizado en esta contribución.
            </p>
          </span>
          <div className="w-full flex flex-col gap-y-2">
            <div className="w-full h-fit grid grid-cols-2 gap-4 text-muted-foreground">
              <span className="w-full flex items-center justify-start">
                <p className="text-sm">Tipo:</p>
              </span>
              <span className="w-full flex items-center justify-end text-foreground font-medium">
                <p className="text-sm">
                  {payment_method.type === "card" ? "Tarjeta" : "Otro"}
                </p>
              </span>
            </div>
            <div className="w-full h-fit grid grid-cols-2 gap-4 text-muted-foreground">
              <span className="w-full flex items-center justify-start">
                <p className="text-sm">Marca:</p>
              </span>
              <span className="w-full flex items-center justify-end text-foreground font-medium capitalize">
                <p className="text-sm">{payment_method.card?.brand}</p>
              </span>
            </div>
            <div className="w-full h-fit grid grid-cols-2 gap-4 text-muted-foreground">
              <span className="w-full flex items-center justify-start">
                <p className="text-sm">Terminación:</p>
              </span>
              <span className="w-full flex items-center justify-end text-foreground font-medium capitalize">
                <p className="text-sm">
                  **** **** **** {payment_method.card?.last4}
                </p>
              </span>
            </div>
          </div>
        </div>
        <Separator />
        <div className="w-full h-fit items-start justify-start flex flex-col gap-y-4">
          <span className="w-full h-fit items-start justify-start flex flex-col gap-y-1">
            <p className="text-sm font-semibold">Detalles de facturación</p>
            <p className="text-xs text-muted-foreground">
              Detalles de facturación utilizados en esta contribución.
            </p>
          </span>
          <div className="w-full flex flex-col gap-y-2">
            <div className="w-full h-fit grid grid-cols-2 gap-4 text-muted-foreground">
              <span className="w-full flex items-center justify-start">
                <p className="text-sm">Dirección:</p>
              </span>
              <span className="w-full flex items-center justify-end text-foreground font-medium">
                <p className="text-sm">
                  {payment_method.billing_details.address.line1}
                </p>
              </span>
            </div>
            <div className="w-full h-fit grid grid-cols-2 gap-4 text-muted-foreground">
              <span className="w-full flex items-center justify-start">
                <p className="text-sm">Ciudad:</p>
              </span>
              <span className="w-full flex items-center justify-end text-foreground font-medium">
                <p className="text-sm">
                  {payment_method.billing_details.address.city}
                </p>
              </span>
            </div>
            <div className="w-full h-fit grid grid-cols-2 gap-4 text-muted-foreground">
              <span className="w-full flex items-center justify-start">
                <p className="text-sm">Estado:</p>
              </span>
              <span className="w-full flex items-center justify-end text-foreground font-medium">
                <p className="text-sm">
                  {payment_method.billing_details.address.state}
                </p>
              </span>
            </div>
            <div className="w-full h-fit grid grid-cols-2 gap-4 text-muted-foreground">
              <span className="w-full flex items-center justify-start">
                <p className="text-sm">País:</p>
              </span>
              <span className="w-full flex items-center justify-end text-foreground font-medium">
                <p className="text-sm">
                  {payment_method.billing_details.address.country}
                </p>
              </span>
            </div>
            <div className="w-full h-fit grid grid-cols-2 gap-4 text-muted-foreground">
              <span className="w-full flex items-center justify-start">
                <p className="text-sm">Código postal:</p>
              </span>
              <span className="w-full flex items-center justify-end text-foreground font-medium">
                <p className="text-sm">
                  {payment_method.billing_details.address.postal_code}
                </p>
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
