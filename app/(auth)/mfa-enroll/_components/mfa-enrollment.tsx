"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import { AlertCircle, CheckCircle2, Copy } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const supabase = createClient();

export const MfaEnrollment = () => {
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const [factorId, setFactorId] = useState<string | null>(null);
  const [verifyCode, setVerifyCode] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [existingFactor, setExistingFactor] = useState(false);

  useEffect(() => {
    checkExistingFactors();
  }, []);

  // Verificar si el usuario ya tiene factores registrados
  const checkExistingFactors = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.mfa.listFactors();

      if (error) {
        throw error;
      }

      // Si hay factores TOTP existentes
      if (data.totp && data.totp.length > 0) {
        setExistingFactor(true);
        setFactorId(data.totp[0].id);
      } else {
        // Si no hay factores, proceder con el enrollment
        enrollMfa();
      }
    } catch (err) {
      console.error(err);
      setError("Error al verificar factores existentes");
    } finally {
      setIsLoading(false);
    }
  };

  const enrollMfa = async () => {
    setIsLoading(true);
    try {
      // Usar un nombre aleatorio para evitar conflictos
      const randomSuffix = Math.floor(Math.random() * 10000);
      const friendlyName = `Knoott-Admin-${randomSuffix}`;

      const { data, error } = await supabase.auth.mfa.enroll({
        factorType: "totp",
        friendlyName: friendlyName,
        issuer: "Knoott",
      });

      if (error) {
        setError(error.message);
        throw error;
      }

      // Extraer datos del QR y el secreto
      const {
        id,
        totp: { qr_code, secret },
      } = data;

      setQrCode(qr_code);
      setSecret(secret);
      setFactorId(id);
    } catch (err) {
      console.error(err);
      if (err instanceof Error) {
        setError(err.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const verifyMfa = async () => {
    if (!factorId) return;

    setIsLoading(true);
    setError("");

    try {
      // Crear un challenge y verificarlo en un solo paso
      const { data, error } = await supabase.auth.mfa.challengeAndVerify({
        factorId,
        code: verifyCode,
      });

      if (error) {
        setError(error.message);
        throw error;
      }

      setSuccess(true);

      // Redirigir después de un breve retraso
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 2000);
    } catch (err) {
      console.error(err);
      if (err instanceof Error) {
        setError(err.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-sm z-10 shadow-md">
      <CardHeader>
        <CardTitle>Configuración de Autenticación de Dos Factores</CardTitle>
        <CardDescription>
          {existingFactor
            ? "Ingresa el código de tu aplicación de autenticación para verificar"
            : "Escanea el código QR con tu aplicación de autenticación"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-600">
              ¡Autenticación de dos factores configurada correctamente!
            </AlertDescription>
          </Alert>
        )}

        {qrCode && !success && !existingFactor && (
          <div className="flex flex-col items-center space-y-4">
            <div className="w-full h-auto aspect-square relative">
              <Image
                src={qrCode || "/placeholder.svg"}
                alt="Código QR para autenticación"
                fill
                className="object-contain"
              />
            </div>

            {secret && (
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">
                  Si no puedes escanear el código QR, ingresa este código en tu
                  aplicación:
                </p>
                <code className="bg-muted p-2 pl-3 text-sm font-mono items-center justify-between gap-2 flex w-full border">
                  {secret}{" "}
                  <Button
                    variant={"outline"}
                    size={"icon"}
                    className="size-7"
                    onClick={() => {
                      if (secret) {
                        navigator.clipboard
                          .writeText(secret)
                          .then(() => {
                            toast.success("Código copiado al portapapeles");
                          })
                          .catch((err) => {
                            console.error("Error al copiar:", err);
                            toast.error("No se pudo copiar el código");
                          });
                      }
                    }}
                    title="Copiar código"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </code>
              </div>
            )}
          </div>
        )}

        {existingFactor && !success && (
          <div className="text-center mb-4">
            <p className="text-amber-600">
              Ya tienes un factor de autenticación configurado. Ingresa el
              código de tu aplicación para verificarlo.
            </p>
          </div>
        )}

        {!success && (
          <div className="space-y-2">
            <Input
              type="text"
              value={verifyCode}
              onChange={(e) => setVerifyCode(e.target.value.trim())}
              placeholder="Código de 6 dígitos"
              maxLength={6}
            />
          </div>
        )}
      </CardContent>
      {!success && (
        <CardFooter className="border-t bg-sidebar">
          <Button
            onClick={verifyMfa}
            className="w-full"
            variant={"defaultBlack"}
            disabled={isLoading || verifyCode.length !== 6 || !factorId}
          >
            {isLoading ? "Verificando..." : "Verificar y activar"}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};
