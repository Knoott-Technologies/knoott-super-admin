"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const CategoryActions = ({ id }: { id: string }) => {
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const router = useRouter();

  const handleApprove = async () => {
    try {
      setIsSubmitting(true);
      const response = await fetch(`/api/categories/${id}/approve`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Failed to approve category");
      }

      setIsApproveDialogOpen(false);

      // Invalidar la caché antes de navegar
      await fetch("/api/revalidate?path=/dashboard/mod/categories", {
        method: "POST",
      });

      // Mostrar toast y navegar
      toast.success("Categoría aprobada", {
        description: "La categoría ha sido aprobada exitosamente.",
      });

      // Usar replace en lugar de push para evitar problemas con el historial
      router.refresh();
      window.location.href = `/dashboard/mod/categories?t=${Date.now()}`;
    } catch (error) {
      toast.error("Error", {
        description: "Ocurrió un error al aprobar la categoría.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async () => {
    try {
      setIsSubmitting(true);
      const response = await fetch(`/api/categories/${id}/reject`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Failed to reject category");
      }

      setIsRejectDialogOpen(false);

      // Invalidar la caché antes de navegar
      await fetch("/api/revalidate?path=/dashboard/mod/categories", {
        method: "POST",
      });

      // Mostrar toast y navegar
      toast.success("Categoría eliminada", {
        description: "La categoría ha sido eliminada exitosamente.",
      });

      // Usar replace en lugar de push
      router.refresh();
      window.location.href = `/dashboard/mod/categories?t=${Date.now()}`;
    } catch (error) {
      toast.error("Error", {
        description: "Ocurrió un error al eliminar la categoría.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle opening dialogs from dropdown
  const openApproveDialog = () => {
    setIsDropdownOpen(false); // Close dropdown first
    setTimeout(() => {
      setIsApproveDialogOpen(true); // Then open dialog after a small delay
    }, 100);
  };

  const openRejectDialog = () => {
    setIsDropdownOpen(false); // Close dropdown first
    setTimeout(() => {
      setIsRejectDialogOpen(true); // Then open dialog after a small delay
    }, 100);
  };

  return (
    <>
      <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant={"outline"} size={"default"}>
            Acciones <ChevronsUpDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[280px]" align="end">
          <DropdownMenuItem
            className="text-success focus:text-success focus:bg-success/10"
            onClick={openApproveDialog}
          >
            Aprobar <Check className="ml-auto" />
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-destructive focus:text-destructive focus:bg-destructive/10"
            onClick={openRejectDialog}
          >
            Rechazar <X className="ml-auto" />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Approve Dialog */}
      <Dialog
        open={isApproveDialogOpen}
        onOpenChange={(open) => {
          setIsApproveDialogOpen(open);
          if (!open) {
            document.body.style.pointerEvents = "";
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirmar aprobación</DialogTitle>
            <DialogDescription>
              ¿Estás seguro que deseas aprobar esta categoría? Esta acción
              cambiará el estado a activo.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsApproveDialogOpen(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              variant="default"
              onClick={handleApprove}
              disabled={isSubmitting}
              className="bg-success hover:bg-success/90 text-background hover:text-background"
            >
              {isSubmitting ? "Aprobando..." : "Aprobar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog
        open={isRejectDialogOpen}
        onOpenChange={(open) => {
          setIsRejectDialogOpen(open);
          if (!open) {
            document.body.style.pointerEvents = "";
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirmar eliminación</DialogTitle>
            <DialogDescription>
              ¿Estás seguro que deseas rechazar esta categoría? Esta acción
              eliminará la categoría permanentemente.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsRejectDialogOpen(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Eliminando..." : "Eliminar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
