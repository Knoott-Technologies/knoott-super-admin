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
import { AlertCircle } from "lucide-react";
import { useState } from "react";

const supabase = createClient();

export const MfaVerification = () => {
  const [verifyCode, setVerifyCode] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const onSubmitClicked = () => {
    setError("");
    setIsLoading(true);
    (async () => {
      try {
        const factors = await supabase.auth.mfa.listFactors();
        if (factors.error) {
          throw factors.error;
        }

        const totpFactor = factors.data.totp[0];

        if (!totpFactor) {
          throw new Error("No se encontraron factores TOTP");
        }

        const factorId = totpFactor.id;

        const challenge = await supabase.auth.mfa.challenge({ factorId });
        if (challenge.error) {
          setError(challenge.error.message);
          throw challenge.error;
        }

        const challengeId = challenge.data.id;

        const verify = await supabase.auth.mfa.verify({
          factorId,
          challengeId,
          code: verifyCode,
        });

        if (verify.error) {
          setError(verify.error.message);
          throw verify.error;
        }

        // Redirigir o mostrar mensaje de éxito
        window.location.href = "/dashboard";
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    })();
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Verificación de Autenticación</CardTitle>
        <CardDescription>
          Ingresa el código de tu aplicación de autenticación
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <div className="space-y-2">
          <Input
            type="text"
            value={verifyCode}
            onChange={(e) => setVerifyCode(e.target.value.trim())}
            placeholder="Código de 6 dígitos"
            maxLength={6}
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={onSubmitClicked}
          className="w-full"
          disabled={isLoading || verifyCode.length !== 6}
        >
          {isLoading ? "Verificando..." : "Verificar"}
        </Button>
      </CardFooter>
    </Card>
  );
};
