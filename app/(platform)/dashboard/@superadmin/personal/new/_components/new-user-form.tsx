"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { ArrowRight, Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Esquema de validación con Zod
const formSchema = z.object({
  email: z.string().email({ message: "Correo electrónico inválido" }),
  first_name: z
    .string()
    .min(2, { message: "El nombre debe tener al menos 2 caracteres" }),
  last_name: z
    .string()
    .min(2, { message: "El apellido debe tener al menos 2 caracteres" }),
  phone_number: z
    .string()
    .min(10, {
      message: "El número de teléfono debe tener al menos 10 dígitos",
    })
    .regex(/^\d+$/, {
      message: "El número de teléfono solo debe contener dígitos",
    }),
  password: z
    .string()
    .min(8, { message: "La contraseña debe tener al menos 8 caracteres" }),
  role: z.enum(["superadmin", "mod", "account_manager", "marketing"], {
    required_error: "Debes seleccionar un rol",
  }),
});

type FormValues = z.infer<typeof formSchema>;

export function NewUserForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Inicializar el formulario con React Hook Form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      first_name: "",
      last_name: "",
      phone_number: "",
      password: "",
      role: undefined,
    },
  });

  // Función para manejar el envío del formulario
  async function onSubmit(values: FormValues) {
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/users/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Ocurrió un error al crear el usuario");
      }

      // Mostrar mensaje de éxito
      if (data.updated) {
        toast.success("Usuario actualizado", {
          description: "El rol del usuario ha sido actualizado exitosamente",
        });
      } else {
        toast.success("Usuario creado", {
          description: "El usuario ha sido creado exitosamente",
        });
      }

      // Resetear el formulario
      form.reset();
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error", {
        description:
          error instanceof Error
            ? error.message
            : "Ocurrió un error al procesar la solicitud",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Crea un nuevo usuario de personal</CardTitle>
        <CardDescription>
          Crea una nueva cuenta de personal en Knoott, recuerda llenar todos los
          datos necesarios.
        </CardDescription>
      </CardHeader>
      <CardContent className="bg-sidebar">
        <Form {...form}>
          <form id="new-user-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Correo electrónico</FormLabel>
                  <FormControl>
                    <Input
                      className="bg-background"
                      placeholder="correo@ejemplo.com"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Este será el correo de acceso del usuario
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="first_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre</FormLabel>
                    <FormControl>
                      <Input
                        className="bg-background"
                        placeholder="Nombre"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="last_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Apellido</FormLabel>
                    <FormControl>
                      <Input
                        className="bg-background"
                        placeholder="Apellido"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="phone_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número de teléfono</FormLabel>
                  <FormControl>
                    <Input
                      className="bg-background"
                      placeholder="1234567890"
                      {...field}
                    />
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
                  <FormLabel>Contraseña</FormLabel>
                  <FormControl>
                    <Input
                      className="bg-background"
                      type="password"
                      placeholder="********"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Mínimo 8 caracteres</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rol</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-background">
                        <SelectValue placeholder="Selecciona un rol" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="superadmin">
                        Super Administrador
                      </SelectItem>
                      <SelectItem value="mod">Moderador</SelectItem>
                      <SelectItem value="account_manager">
                        Auxiliar de cuenta
                      </SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    El rol determina los permisos del usuario
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </CardContent>
      <CardFooter className="bg-background border-t">
        <Button
          type="submit"
          variant={"defaultBlack"}
          className="w-full"
          disabled={isSubmitting}
          form="new-user-form"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Procesando...
            </>
          ) : (
            <>
              Crear usuario <ArrowRight />
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
