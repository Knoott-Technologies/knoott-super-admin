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
import { Button } from "@/components/ui/button";
import { ArrowRight, Copy, Upload } from "lucide-react";
import { cn, formatPrice } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { useState, useRef } from "react";
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
import { useRouter } from "next/navigation";
import { PartnerPayment } from "../page";
import { Input } from "@/components/ui/input";

export const PartnerPaymentsActions = ({ data }: { data: PartnerPayment }) => {
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copiado al portapapeles");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Check file type (PDF or image)
      const validTypes = [
        "application/pdf",
        "image/jpeg",
        "image/png",
        "image/jpg",
      ];
      if (!validTypes.includes(file.type)) {
        toast.error("Solo se permiten archivos PDF o imágenes (JPG, PNG)");
        return;
      }

      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("El archivo no debe exceder 5MB");
        return;
      }

      setSelectedFile(file);
    }
  };

  const handleConfirm = async () => {
    if (!selectedFile) {
      toast.error("Por favor sube un comprobante de pago");
      return;
    }

    setIsSubmitting(true);
    try {
      // Create form data for file upload
      const formData = new FormData();
      formData.append("receipt", selectedFile);
      formData.append("providerId", data.provider.id);
      formData.append("orderId", data.id.toString());
      formData.append("amount", data.povider_received_amount.toString());

      const response = await fetch(
        `/api/partners/${data.provider.id}/payment`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al confirmar el pago");
      }

      toast.success("Pago confirmado exitosamente");
      router.refresh();
      setIsDialogOpen(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Error al confirmar el pago"
      );
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
              <SheetTitle>Pago a {data.provider.business_name}</SheetTitle>
              <SheetDescription>
                Completa el pago de la orden al proveedor.
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
                      {formatPrice(data.total_amount)}
                    </p>
                  </span>
                  <span className="w-full h-fit items-center justify-between flex">
                    <p className="text-muted-foreground text-sm ">
                      Monto a proveedor:
                    </p>
                    <p className="font-semibold text-sm">
                      {formatPrice(data.povider_received_amount || 0)}
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
                  Información bancaria del proveedor:
                </p>
                <div className="flex flex-col gap-y-2 w-full p-3 bg-sidebar border">
                  <span className="w-full h-fit items-center justify-between flex">
                    <p className="text-muted-foreground text-sm ">Titular:</p>
                    <p
                      className="font-semibold text-sm flex gap-x-2 group items-center hover:underline ease-in-out cursor-pointer"
                      onClick={() =>
                        handleCopy(data.provider.business_legal_name!)
                      }
                    >
                      <Copy className="!size-3.5 opacity-0 group-hover:opacity-100 ease-in-out" />
                      {data.provider.business_legal_name}
                    </p>
                  </span>
                  <span className="w-full h-fit items-center justify-between flex">
                    <p className="text-muted-foreground text-sm">CLABE:</p>
                    <p
                      className="font-semibold text-sm flex gap-x-2 group items-center hover:underline ease-in-out cursor-pointer"
                      onClick={() =>
                        handleCopy(
                          data.provider.bank_account_number!.toString()
                        )
                      }
                    >
                      <Copy className="!size-3.5 opacity-0 group-hover:opacity-100 ease-in-out" />
                      {data.provider.bank_account_number!}
                    </p>
                  </span>
                  <span className="w-full h-fit items-center justify-between flex">
                    <p className="text-muted-foreground text-sm ">Banco:</p>
                    <p className="font-semibold text-sm">
                      {data.provider.bank_name}
                    </p>
                  </span>
                  <Separator />
                  <span className="w-full h-fit items-center justify-between flex">
                    <p className="text-muted-foreground text-sm ">Monto:</p>
                    <p className="font-semibold text-sm">
                      {formatPrice(data.povider_received_amount || 0)}
                    </p>
                  </span>
                  <span className="w-full h-fit items-center justify-between flex">
                    <p className="text-muted-foreground text-sm ">
                      Referencia:
                    </p>
                    <p
                      className="font-semibold text-sm flex gap-x-2 group items-center hover:underline ease-in-out cursor-pointer"
                      onClick={() => handleCopy(`Pago por orden - ${data.id}`)}
                    >
                      {" "}
                      <Copy className="!size-3.5 opacity-0 group-hover:opacity-100 ease-in-out" />
                      Pago por orden - {data.id}
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
                      onClick={() =>
                        handleCopy(`Comisión por compra - ${data.id}`)
                      }
                    >
                      {" "}
                      <Copy className="!size-3.5 opacity-0 group-hover:opacity-100 ease-in-out" />
                      Comisión por compra - {data.id}
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
                Confirmar pago <ArrowRight />
              </Button>
            </SheetFooter>
          </div>
        </SheetContent>
      </Sheet>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="p-0">
          <DialogHeader className="p-3 bg-sidebar border-b">
            <DialogTitle>Subir comprobante de pago</DialogTitle>
            <DialogDescription>
              Sube un comprobante de pago (imagen o PDF) para confirmar la
              transferencia de {formatPrice(data.povider_received_amount || 0)}{" "}
              al proveedor.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-y-4 p-3 w-full">
            <div className="flex flex-col items-start gap-2 w-full">
              <span className="w-full flex flex-col">
                <Label htmlFor="receipt-upload">Comprobante de pago</Label>
                <p className="text-muted-foreground text-sm">
                  Sube una imagen o PDF del comprobante de transferencia
                </p>
              </span>

              <div className="w-full flex flex-col gap-2">
                <Input
                  id="receipt-upload"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                  ref={fileInputRef}
                  className="hidden"
                />

                <div
                  className={cn(
                    "border-2 border-dashed rounded-md p-6 w-full flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-muted-foreground/50 transition-colors",
                    selectedFile
                      ? "border-green-500/50 bg-green-50"
                      : "border-muted-foreground/25"
                  )}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload
                    className={cn(
                      "h-8 w-8",
                      selectedFile
                        ? "text-green-500"
                        : "text-muted-foreground/50"
                    )}
                  />
                  {selectedFile ? (
                    <p className="text-sm font-medium text-center">
                      {selectedFile.name} (
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                    </p>
                  ) : (
                    <p className="text-sm text-muted-foreground text-center">
                      Haz clic para seleccionar un archivo o arrastra y suelta
                      aquí
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground text-center">
                    PDF, JPG o PNG (máx. 5MB)
                  </p>
                </div>

                {selectedFile && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => setSelectedFile(null)}
                  >
                    Cambiar archivo
                  </Button>
                )}
              </div>
            </div>
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
              disabled={isSubmitting || !selectedFile}
              variant={"defaultBlack"}
            >
              {isSubmitting ? "Procesando..." : "Confirmar pago"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
