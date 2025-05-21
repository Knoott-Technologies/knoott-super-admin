"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Withdrawal } from "../page";
import { Button } from "@/components/ui/button";
import { ArrowRight, Copy } from "lucide-react";
import { cn, formatPrice } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { AmountInput } from "@/components/common/amount-input";
import { useRouter } from "next/navigation";

export const WithdrawalSheetActions = ({ data }: { data: Withdrawal }) => {
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userAmount, setUserAmount] = useState<number>(0);
  const [kcaAmount, setKcaAmount] = useState<number>(0);
  const [error, setError] = useState("");

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copiado al portapapeles");
  };

  const validateAmounts = () => {
    if (isNaN(userAmount) || isNaN(kcaAmount)) {
      setError("Por favor ingresa montos válidos");
      return false;
    }

    const totalAmount = userAmount + kcaAmount;
    const expectedAmount = data.amount;

    // Allow a small difference due to floating point precision
    if (Math.abs(totalAmount - expectedAmount) > 0.01) {
      setError(
        `La suma de los montos debe ser igual a ${formatPrice(expectedAmount)}`
      );
      return false;
    }

    setError("");
    return true;
  };

  const handleConfirm = async () => {
    if (!validateAmounts()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/withdrawals/${data.id}/confirm`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userReceivedAmount: userAmount,
          knoottReceivedAmount: kcaAmount,
        }),
      });

      if (!response.ok) {
        throw new Error("Error al confirmar el retiro");
      }

      toast.success("Retiro confirmado exitosamente");
      router.refresh();
      setIsDialogOpen(false);
    } catch (error) {
      toast.error("Error al confirmar el retiro");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Sheet>
        <SheetTrigger asChild>
          <Button size={"sm"} className="h-7 text-xs gap-1" variant={"outline"}>
            Completar <ArrowRight className="!size-3.5" />
          </Button>
        </SheetTrigger>
        <SheetContent
          className={cn("bg-sidebar p-0 text-sidebar-foreground")}
          side={"right"}
        >
          <div className="flex h-full w-full flex-col">
            <SheetHeader className="bg-sidebar border-b p-3 text-start">
              <SheetTitle>Retiro</SheetTitle>
              <SheetDescription>
                Completa la transacción de tu compra.
              </SheetDescription>
            </SheetHeader>
            <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-auto bg-background text-foreground p-3">
              <span className="w-full h-fit items-start justify-start flex flex-col gap-y-2">
                <p className="text-sm font-semibold">
                  Información de la transacción:
                </p>
                <div className="flex flex-col gap-y-2 w-full">
                  <span className="w-full h-fit items-center justify-between flex">
                    <p className="text-muted-foreground text-sm ">Total:</p>
                    <p className="font-semibold text-sm">
                      {formatPrice(data.amount)}
                    </p>
                  </span>
                  <span className="w-full h-fit items-center justify-between flex">
                    <p className="text-muted-foreground text-sm ">
                      Monto a usuario:
                    </p>
                    <p className="font-semibold text-sm">
                      {formatPrice(data.user_received_amount || 0)}
                    </p>
                  </span>
                  <span className="w-full h-fit items-center justify-between flex">
                    <p className="text-muted-foreground text-sm ">
                      Monto a KCA:
                    </p>
                    <p className="font-semibold text-sm">
                      {formatPrice(data.knoott_received_amount || 0)}
                    </p>
                  </span>
                </div>
              </span>
              <Separator />
              <span className="w-full h-fit items-start justify-start flex flex-col gap-y-2">
                <p className="text-sm font-semibold">
                  Información bancaria del usuario:
                </p>
                <div className="flex flex-col gap-y-2 w-full p-3 bg-sidebar border">
                  <span className="w-full h-fit items-center justify-between flex">
                    <p className="text-muted-foreground text-sm ">Titular:</p>
                    <p
                      className="font-semibold text-sm flex gap-x-2 group items-center hover:underline ease-in-out cursor-pointer"
                      onClick={() => handleCopy(data.wedding.account_holder!)}
                    >
                      <Copy className="!size-3.5 opacity-0 group-hover:opacity-100 ease-in-out" />
                      {data.wedding.account_holder}
                    </p>
                  </span>
                  <span className="w-full h-fit items-center justify-between flex">
                    <p className="text-muted-foreground text-sm">CLABE:</p>
                    <p
                      className="font-semibold text-sm flex gap-x-2 group items-center hover:underline ease-in-out cursor-pointer"
                      onClick={() =>
                        handleCopy(data.wedding.bank_account_number.toString())
                      }
                    >
                      <Copy className="!size-3.5 opacity-0 group-hover:opacity-100 ease-in-out" />
                      {data.wedding.bank_account_number}
                    </p>
                  </span>
                  <span className="w-full h-fit items-center justify-between flex">
                    <p className="text-muted-foreground text-sm ">Banco:</p>
                    <p className="font-semibold text-sm">{data.wedding.bank}</p>
                  </span>
                  <Separator />
                  <span className="w-full h-fit items-center justify-between flex">
                    <p className="text-muted-foreground text-sm ">Monto:</p>
                    <p className="font-semibold text-sm">
                      {formatPrice(data.user_received_amount || 0)}
                    </p>
                  </span>
                  <span className="w-full h-fit items-center justify-between flex">
                    <p className="text-muted-foreground text-sm ">
                      Referencia:
                    </p>
                    <p
                      className="font-semibold text-sm flex gap-x-2 group items-center hover:underline ease-in-out cursor-pointer"
                      onClick={() => handleCopy(`Retiro - ${data.reference}`)}
                    >
                      {" "}
                      <Copy className="!size-3.5 opacity-0 group-hover:opacity-100 ease-in-out" />
                      Retiro - {data.reference}
                    </p>
                  </span>
                </div>
              </span>
              <Separator />
              <span className="w-full h-fit items-start justify-start flex flex-col gap-y-2">
                <p className="text-sm font-semibold">
                  Información bancaria de Knoott Commission Account:
                </p>
                <div className="flex flex-col gap-y-2 w-full p-3 bg-sidebar border">
                  <span className="w-full h-fit items-center justify-between flex">
                    <p className="text-muted-foreground text-sm ">Titular:</p>
                    <p
                      className="font-semibold text-sm flex gap-x-2 group items-center hover:underline ease-in-out cursor-pointer"
                      onClick={() =>
                        handleCopy("Knoott Technologies S.A.P.I. de C.V.")
                      }
                    >
                      <Copy className="!size-3.5 opacity-0 group-hover:opacity-100 ease-in-out" />
                      Knoott Technologies S.A.P.I. de C.V.
                    </p>
                  </span>
                  <span className="w-full h-fit items-center justify-between flex">
                    <p className="text-muted-foreground text-sm">CLABE:</p>
                    <p
                      className="font-semibold text-sm flex gap-x-2 group items-center hover:underline ease-in-out cursor-pointer"
                      onClick={() => handleCopy("012060001248905237")}
                    >
                      <Copy className="!size-3.5 opacity-0 group-hover:opacity-100 ease-in-out" />
                      012060001248905237
                    </p>
                  </span>
                  <span className="w-full h-fit items-center justify-between flex">
                    <p className="text-muted-foreground text-sm ">Banco:</p>
                    <p className="font-semibold text-sm">BBVA</p>
                  </span>
                  <Separator />
                  <span className="w-full h-fit items-center justify-between flex">
                    <p className="text-muted-foreground text-sm ">Monto:</p>
                    <p className="font-semibold text-sm">
                      {formatPrice(data.knoott_received_amount || 0)}
                    </p>
                  </span>
                  <span className="w-full h-fit items-center justify-between flex">
                    <p className="text-muted-foreground text-sm ">
                      Referencia:
                    </p>
                    <p
                      className="font-semibold text-sm flex gap-x-2 group items-center hover:underline ease-in-out cursor-pointer"
                      onClick={() => handleCopy(`Comisión - ${data.reference}`)}
                    >
                      {" "}
                      <Copy className="!size-3.5 opacity-0 group-hover:opacity-100 ease-in-out" />
                      Comisión - {data.reference}
                    </p>
                  </span>
                </div>
              </span>
            </div>
            <SheetFooter className="flex flex-col sm:flex-col sm:justify-start gap-y-2 p-3 pb-8 md:pb-3 border-t bg-sidebar">
              <Button
                className="w-full"
                variant={"defaultBlack"}
                onClick={() => setIsDialogOpen(true)}
              >
                Confirmar retiro <ArrowRight />
              </Button>
            </SheetFooter>
          </div>
        </SheetContent>
      </Sheet>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="p-0">
          <DialogHeader className="p-3 bg-sidebar border-b">
            <DialogTitle>Confirmar retiro</DialogTitle>
            <DialogDescription>
              Ingresa los montos exactos que se transferirán al usuario y a KCA.
              La suma debe ser igual a {formatPrice(data.amount)}.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-y-4 p-3 w-full">
            <div className="flex flex-col items-start gap-2 w-full">
              <span className="w-full flex flex-col">
                <Label htmlFor="user-amount">Monto al usuario</Label>
                <p className="text-muted-foreground text-sm">
                  Ingresa el monto que se transferirá al usuario
                </p>
              </span>
              <div className="w-full flex">
                <AmountInput
                  placeholder={`${formatPrice(data.user_received_amount || 0)}`}
                  value={userAmount}
                  onChange={(e) => setUserAmount(e)}
                  className="w-full bg-sidebar"
                />
              </div>
            </div>
            <div className="flex flex-col items-start gap-2 w-full">
              <span className="w-full flex flex-col">
                <Label htmlFor="user-amount">Monto a KCA</Label>
                <p className="text-muted-foreground text-sm">
                  Ingresa el monto que se transferirá a Knoott Commission
                  Account
                </p>
              </span>
              <div className="w-full flex">
                <AmountInput
                  placeholder={`${formatPrice(
                    data.knoott_received_amount || 0
                  )}`}
                  value={kcaAmount}
                  onChange={(e) => setKcaAmount(e)}
                  className="w-full bg-sidebar"
                />
              </div>
            </div>
            {error && (
              <div className="text-sm font-medium text-destructive">
                {error}
              </div>
            )}
            <Separator />
            <span className="w-full flex flex-col gap-y-2">
              <div className="flex items-center justify-between gap-2">
                <div className="text-sm text-muted-foreground">Total:</div>
                <div className=" font-medium">
                  {formatPrice((userAmount || 0) + (kcaAmount || 0))}
                </div>
              </div>
              <div className="flex items-center justify-between gap-2">
                <div className="text-sm text-muted-foreground">Esperado:</div>
                <div className=" font-medium">{formatPrice(data.amount)}</div>
              </div>
            </span>
          </div>
          <DialogFooter className="p-3 bg-sidebar border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={handleConfirm}
              disabled={isSubmitting}
              variant={"defaultBlack"}
            >
              {isSubmitting ? "Procesando..." : "Confirmar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
