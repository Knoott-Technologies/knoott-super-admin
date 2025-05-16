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

export const CatalogCollectionActions = ({ id }: { id: string }) => {
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const router = useRouter();

  const handleApprove = async () => {
    try {
      setIsSubmitting(true);
      const response = await fetch(`/api/catalog-collections/${id}/approve`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to approve collection");
      }

      setIsApproveDialogOpen(false);

      // Add a small delay before showing the toast to ensure dialog is fully closed
      setTimeout(() => {
        toast.success("Colección aprobada", {
          description: "La colección ha sido aprobada exitosamente.",
        });
        router.refresh();
      }, 100);
    } catch (error) {
      toast.error("Error", {
        description: "Ocurrió un error al aprobar la colección.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async () => {
    try {
      setIsSubmitting(true);
      const response = await fetch(`/api/catalog-collections/${id}/reject`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to reject collection");
      }

      setIsRejectDialogOpen(false);

      // Add a small delay before showing the toast to ensure dialog is fully closed
      setTimeout(() => {
        toast.success("Colección eliminada", {
          description: "La colección ha sido eliminada exitosamente.",
        });
        router.refresh();
      }, 100);
    } catch (error) {
      toast.error("Error", {
        description: "Ocurrió un error al eliminar la colección.",
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
              ¿Estás seguro que deseas aprobar esta colección? Esta acción
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
              className="bg-success hover:bg-success/90"
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
              ¿Estás seguro que deseas rechazar esta colección? Esta acción
              eliminará la colección permanentemente.
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
