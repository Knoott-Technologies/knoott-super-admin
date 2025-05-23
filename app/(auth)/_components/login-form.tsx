"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import { ArrowRight, EyeIcon, EyeOffIcon, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const supabase = createClient();

const formSchema = z.object({
  email: z.string().email({ message: "Ingresa un correo electrónico válido" }),
  password: z.string().min(6, {
    message: "La contraseña debe tener al menos 6 caracteres",
  }),
});

export function LoginForm() {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const toggleVisibility = () => setIsVisible((prevState) => !prevState);

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    try {
      // Iniciar sesión con email y contraseña
      const {
        data: { user },
        error,
      } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (error || !user) {
        toast.error("Hubo un error al iniciar sesión", {
          description: "Por favor verifica tus datos e intenta nuevamente.",
        });
        return;
      }

      // Verificar el nivel de autenticación del usuario
      const { data: aalData, error: aalError } =
        await supabase.auth.mfa.getAuthenticatorAssuranceLevel();

      if (aalError) {
        console.error("Error al verificar nivel de autenticación:", aalError);
        toast.error("Error al verificar estado de autenticación");
        return;
      }

      toast.success(
        `Bienvenid@ a tu cuenta, ${user?.user_metadata.first_name}`
      );

      // Determinar a dónde redirigir al usuario según su nivel de AAL
      if (aalData.currentLevel === "aal1") {
        // Verificar si el usuario tiene factores MFA configurados
        const { data: factorsData, error: factorsError } =
          await supabase.auth.mfa.listFactors();

        if (factorsError) {
          console.error("Error al listar factores MFA:", factorsError);
          router.replace("/dashboard"); // Redirigir al dashboard en caso de error
          return;
        }

        // Si tiene factores TOTP configurados, redirigir a verificación
        if (factorsData.totp && factorsData.totp.length > 0) {
          router.replace("/mfa-verify");
        } else {
          // Si no tiene factores, redirigir a la página de registro MFA
          router.replace("/mfa-enroll");
        }
      } else if (aalData.currentLevel === "aal2") {
        // El usuario ya está completamente autenticado con MFA
        router.replace("/dashboard");
      }
    } catch (error) {
      console.error("Error en el proceso de inicio de sesión:", error);
      toast.error("Ocurrió un error inesperado");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-lg shadow-md bg-background z-10">
      <CardContent>
        <Form {...form}>
          <form
            id="login-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Correo electrónico:</FormLabel>
                  <FormControl>
                    <Input className="bg-sidebar" placeholder="email@email.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contraseña:</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        className="pe-9 bg-sidebar"
                        placeholder="Password"
                        {...field}
                        type={isVisible ? "text" : "password"}
                      />
                      <Button
                        className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                        type="button"
                        onClick={toggleVisibility}
                        aria-label={
                          isVisible ? "Hide password" : "Show password"
                        }
                        aria-pressed={isVisible}
                        aria-controls="password"
                        variant={"ghost"}
                      >
                        {isVisible ? (
                          <EyeOffIcon size={16} aria-hidden="true" />
                        ) : (
                          <EyeIcon size={16} aria-hidden="true" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </CardContent>
      <CardFooter className="w-full border-t bg-sidebar">
        <Button
          variant={"defaultBlack"}
          className="w-full"
          type="submit"
          form="login-form"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Verificando...
            </>
          ) : (
            <>
              Ingresar <ArrowRight className="ml-2" />
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
