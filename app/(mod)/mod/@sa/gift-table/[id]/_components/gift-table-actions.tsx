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

export const GiftTableActions = ({ id }: { id: string }) => {
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleApprove = async () => {
    try {
      setIsSubmitting(true);
      const response = await fetch(`/api/gift-tables/${id}/accept`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to approve gift table");
      }

      toast.success("Mesa de regalos aprobada", {
        description: "La mesa de regalos ha sido aprobada exitosamente.",
      });
      setIsApproveDialogOpen(false);
      // Refresh the page or update the UI as needed
      router.replace("/mod/gift-tables");
    } catch (error) {
      toast.error("Error", {
        description: "Ocurrió un error al aprobar la mesa de regalos.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      toast.error("Error", {
        description: "Por favor, ingresa un motivo de rechazo.",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await fetch(`/api/gift-tables/${id}/reject`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ rejectedReason: rejectReason }),
      });

      if (!response.ok) {
        throw new Error("Failed to reject gift table");
      }

      toast.success("Mesa de regalos rechazada", {
        description: "La mesa de regalos ha sido rechazada.",
      });
      setIsRejectDialogOpen(false);
      // Refresh the page or update the UI as needed
      router.replace("/mod/gift-tables");
    } catch (error) {
      toast.error("Error", {
        description: "Ocurrió un error al rechazar la mesa de regalos.",
      });
    } finally {
      setIsSubmitting(false);
      setRejectReason("");
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
              ¿Estás seguro que deseas aprobar esta mesa de regalos? Esta acción
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
            <DialogTitle>Rechazar mesa de regalos</DialogTitle>
            <DialogDescription>
              Por favor, ingresa el motivo por el cual estás rechazando esta
              mesa de regalos.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Motivo de rechazo"
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
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
