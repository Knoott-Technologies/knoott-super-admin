"use client";

import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu";
import type { Users } from "../page";
import { Button } from "@/components/ui/button";
import { Check, MoreHorizontal, UserCog, UserMinus } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { getRoleLabel } from "@/lib/utils";

type Role = "superadmin" | "mod" | "account_manager" | "marketing" | null;

export const PersonalActions = ({ data }: { data: Users }) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Si el usuario es superadmin, no se puede modificar
  const isSuperAdmin = data.role === "superadmin";

  const handleChangeRole = async (newRole: Role) => {
    if (newRole === data.role) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/users/${data.id}/role`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role: newRole }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al actualizar el rol");
      }

      toast.success(
        newRole === null
          ? "Rol eliminado"
          : `Rol actualizado a ${getRoleLabel(newRole)}`,
        {
          description:
            newRole === null
              ? "Se ha eliminado el rol del usuario correctamente"
              : "El rol del usuario ha sido actualizado correctamente",
        }
      );

      // Refrescar la página para ver los cambios
      router.refresh();
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error", {
        description:
          error instanceof Error
            ? error.message
            : "Ocurrió un error al actualizar el rol",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild disabled={isLoading}>
        <Button
          variant={"ghost"}
          size={"icon"}
          className="size-6 lg:absolute lg:right-2 lg:group-hover/row:opacity-100 data-[state=open]:opacity-100 lg:opacity-0 ease-in-out transition-all lg:top-1/2 lg:-translate-y-1/2"
        >
          <MoreHorizontal />
        </Button>
      </DropdownMenuTrigger>

      {!isSuperAdmin && (
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Acciones de usuario</DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuSub>
            <DropdownMenuSubTrigger disabled={isLoading}>
              <UserCog className="mr-2 h-4 w-4" />
              <span>Cambiar rol</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem
                  onClick={() => handleChangeRole("mod")}
                  disabled={data.role === "mod" || isLoading}
                >
                  <span>Moderador</span>
                  {data.role === "mod" && <Check className="ml-auto h-4 w-4" />}
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => handleChangeRole("account_manager")}
                  disabled={data.role === "account_manager" || isLoading}
                >
                  <span>Account Manager</span>
                  {data.role === "account_manager" && (
                    <Check className="ml-auto h-4 w-4" />
                  )}
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => handleChangeRole("marketing")}
                  disabled={data.role === "marketing" || isLoading}
                >
                  <span>Marketing</span>
                  {data.role === "marketing" && (
                    <Check className="ml-auto h-4 w-4" />
                  )}
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>

          <DropdownMenuItem
            onClick={() => handleChangeRole(null)}
            disabled={isLoading}
            className="text-destructive focus:text-destructive focus:bg-destructive/10"
          >
            <UserMinus className="mr-2 h-4 w-4" />
            <span>Quitar rol</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      )}
    </DropdownMenu>
  );
};
