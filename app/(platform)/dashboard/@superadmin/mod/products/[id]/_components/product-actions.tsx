"use client";

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
import { Textarea } from "@/components/ui/textarea";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export const ProductActions = ({ id }: { id: string }) => {
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const router = useRouter();

  const handleApprove = async () => {
    try {
      setIsSubmitting(true);
      const response = await fetch(`/api/products/${id}/approve`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to approve product");
      }

      setIsApproveDialogOpen(false);

      // Add a small delay before showing the toast to ensure dialog is fully closed
      setTimeout(() => {
        toast.success("Producto aprobado", {
          description: "El producto ha sido aprobado exitosamente.",
        });
        window.location.href = "/dashboard/mod/products";
      }, 100);
    } catch (error) {
      toast.error("Error", {
        description: "Ocurrió un error al aprobar el producto.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      toast.error("Error", {
        description: "Por favor, ingresa un motivo de rechazo.",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await fetch(`/api/products/${id}/reject`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ rejectionReason }),
      });

      if (!response.ok) {
        throw new Error("Failed to reject product");
      }

      setIsRejectDialogOpen(false);

      // Add a small delay before showing the toast to ensure dialog is fully closed
      setTimeout(() => {
        toast.success("Producto rechazado", {
          description: "El producto ha sido rechazado.",
        });
        window.location.href = "/dashboard/mod/products";
      }, 100);
    } catch (error) {
      toast.error("Error", {
        description: "Ocurrió un error al rechazar el producto.",
      });
    } finally {
      setIsSubmitting(false);
      setRejectionReason("");
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

      {/* Approve Dialog - Completely separate from DropdownMenu */}
      <Dialog
        open={isApproveDialogOpen}
        onOpenChange={(open) => {
          setIsApproveDialogOpen(open);
          if (!open) {
            // Ensure any lingering overlays are cleared
            document.body.style.pointerEvents = "";
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirmar aprobación</DialogTitle>
            <DialogDescription>
              ¿Estás seguro que deseas aprobar este producto? Esta acción
              cambiará el estado a draft.
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

      {/* Reject Dialog - Completely separate from DropdownMenu */}
      <Dialog
        open={isRejectDialogOpen}
        onOpenChange={(open) => {
          setIsRejectDialogOpen(open);
          if (!open) {
            // Ensure any lingering overlays are cleared
            document.body.style.pointerEvents = "";
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Rechazar producto</DialogTitle>
            <DialogDescription>
              Por favor, ingresa el motivo por el cual estás rechazando este
              producto.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Motivo de rechazo"
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            className="min-h-[100px]"
          />
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
              {isSubmitting ? "Rechazando..." : "Rechazar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
