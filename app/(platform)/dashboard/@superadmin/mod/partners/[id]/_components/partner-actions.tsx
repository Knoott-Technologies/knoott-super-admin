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
import { Textarea } from "@/components/ui/textarea";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const ProviderBusinessActions = ({ id }: { id: string }) => {
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleApprove = async () => {
    try {
      setIsSubmitting(true);
      const response = await fetch(`/api/providers/${id}/accept`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to approve provider business");
      }

      toast.success("Proveedor aprobado", {
        description: "El proveedor ha sido verificado exitosamente.",
      });
      setIsApproveDialogOpen(false);
      // Refresh the page or update the UI as needed
      router.replace("/dashboard/mod/partners");
    } catch (error) {
      toast.error("Error", {
        description: "Ocurrió un error al aprobar el proveedor.",
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
      const response = await fetch(`/api/providers/${id}/reject`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ rejectionReason }),
      });

      if (!response.ok) {
        throw new Error("Failed to reject provider business");
      }

      toast.success("Proveedor rechazado", {
        description: "El proveedor ha sido rechazado.",
      });
      setIsRejectDialogOpen(false);
      // Refresh the page or update the UI as needed
      router.replace("/dashboard/mod/partners");
    } catch (error) {
      toast.error("Error", {
        description: "Ocurrió un error al rechazar el proveedor.",
      });
    } finally {
      setIsSubmitting(false);
      setRejectionReason("");
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={"outline"} size={"default"}>
            Acciones <ChevronsUpDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[280px]" align="end">
          <DropdownMenuItem
            className="text-success focus:text-success focus:bg-success/10"
            onClick={() => setIsApproveDialogOpen(true)}
          >
            Aprobar <Check className="ml-auto" />
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-destructive focus:text-destructive focus:bg-destructive/10"
            onClick={() => setIsRejectDialogOpen(true)}
          >
            Rechazar <X className="ml-auto" />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Approve Dialog */}
      <Dialog open={isApproveDialogOpen} onOpenChange={setIsApproveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar aprobación</DialogTitle>
            <DialogDescription>
              ¿Estás seguro que deseas aprobar este proveedor? Esta acción
              cambiará el estado a verificado.
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
      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rechazar proveedor</DialogTitle>
            <DialogDescription>
              Por favor, ingresa el motivo por el cual estás rechazando este
              proveedor.
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
