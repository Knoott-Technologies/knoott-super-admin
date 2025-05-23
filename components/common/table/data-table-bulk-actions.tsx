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
import { Check, ChevronsUpDown, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { Table } from "@tanstack/react-table";
import { useRouter } from "next/navigation";

interface DataTableBulkActionsProps<TData> {
  table: Table<TData>;
  entityType: "products" | "brands" | "gift_tables" | "collections" | string;
  approveAction?: (
    ids: string[]
  ) => Promise<{ success: boolean; error?: string }>;
  rejectAction?: (
    ids: string[]
  ) => Promise<{ success: boolean; error?: string }>;
  idField?: keyof TData;
  successRedirectPath?: string;
}

export function DataTableBulkActions<TData>({
  table,
  entityType,
  approveAction,
  rejectAction,
  idField = "id" as keyof TData,
  successRedirectPath,
}: DataTableBulkActionsProps<TData>) {
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const router = useRouter();

  const selectedRows = table.getFilteredSelectedRowModel().rows;
  const selectedCount = selectedRows.length;
  const hasSelected = selectedCount > 0;

  // Obtener los IDs de las filas seleccionadas
  const getSelectedIds = (): string[] => {
    return selectedRows.map((row) => String(row.original[idField]));
  };

  // Función para manejar la aprobación masiva
  const handleBulkApprove = async () => {
    if (!hasSelected) return;

    try {
      setIsSubmitting(true);
      const ids = getSelectedIds();

      let result;

      if (approveAction) {
        // Usar la función personalizada si se proporciona
        result = await approveAction(ids);
      } else {
        // Usar la API predeterminada
        const response = await fetch(`/api/${entityType}/bulk-approve`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ids }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Error al aprobar elementos");
        }

        result = { success: true };
      }

      if (!result.success) {
        throw new Error(result.error || "Error al aprobar elementos");
      }

      setIsApproveDialogOpen(false);

      // Limpiar selección
      table.resetRowSelection();

      // Mostrar notificación de éxito
      toast.success(`Elementos aprobados`, {
        description: `${selectedCount} ${
          selectedCount === 1
            ? "elemento ha sido aprobado"
            : "elementos han sido aprobados"
        } exitosamente.`,
      });

      // Recargar datos
      router.refresh();

      // Redirigir si se proporciona una ruta
      if (successRedirectPath) {
        window.location.href = successRedirectPath;
      }
    } catch (error) {
      toast.error("Error", {
        description:
          error instanceof Error
            ? error.message
            : "Ocurrió un error al aprobar los elementos.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Función para manejar el rechazo masivo
  const handleBulkReject = async () => {
    if (!hasSelected) return;

    try {
      setIsSubmitting(true);
      const ids = getSelectedIds();

      let result;

      if (rejectAction) {
        // Usar la función personalizada si se proporciona
        result = await rejectAction(ids);
      } else {
        // Usar la API predeterminada
        const response = await fetch(`/api/${entityType}/bulk-reject`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ids }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Error al rechazar elementos");
        }

        result = { success: true };
      }

      if (!result.success) {
        throw new Error(result.error || "Error al rechazar elementos");
      }

      setIsRejectDialogOpen(false);

      // Limpiar selección
      table.resetRowSelection();

      // Mostrar notificación de éxito
      toast.success(`Elementos rechazados`, {
        description: `${selectedCount} ${
          selectedCount === 1
            ? "elemento ha sido rechazado"
            : "elementos han sido rechazados"
        } exitosamente.`,
      });

      // Recargar datos
      router.refresh();

      // Redirigir si se proporciona una ruta
      if (successRedirectPath) {
        window.location.href = successRedirectPath;
      }
    } catch (error) {
      toast.error("Error", {
        description:
          error instanceof Error
            ? error.message
            : "Ocurrió un error al rechazar los elementos.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Abrir diálogos desde el menú desplegable
  const openApproveDialog = () => {
    setIsDropdownOpen(false);
    setTimeout(() => {
      setIsApproveDialogOpen(true);
    }, 100);
  };

  const openRejectDialog = () => {
    setIsDropdownOpen(false);
    setTimeout(() => {
      setIsRejectDialogOpen(true);
    }, 100);
  };

  if (!hasSelected) {
    return null;
  }

  return (
    <>
      {selectedCount && selectedCount > 0 && (
        <div className="flex items-center gap-2 justify-between p-2 bg-sidebar border w-full">
          <span className="text-sm text-muted-foreground">
            {selectedCount} {selectedCount === 1 ? "elemento" : "elementos"}{" "}
            seleccionado
            {selectedCount !== 1 ? "s" : ""}
          </span>
          <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="">
                Acciones <ChevronsUpDown className=" h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                className="text-success focus:text-success focus:bg-success/10"
                onClick={openApproveDialog}
              >
                Aprobar seleccionados <Check className="ml-auto" />
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive focus:bg-destructive/10"
                onClick={openRejectDialog}
              >
                Rechazar seleccionados <X className="ml-auto" />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}

      {/* Diálogo de aprobación masiva */}
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
            <DialogTitle>Confirmar aprobación masiva</DialogTitle>
            <DialogDescription>
              ¿Estás seguro que deseas aprobar {selectedCount}{" "}
              {selectedCount === 1 ? "elemento" : "elementos"}? Esta acción
              cambiará su estado a activo.
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
              onClick={handleBulkApprove}
              disabled={isSubmitting}
              className="bg-success hover:bg-success/90 text-background hover:text-background"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Aprobando...
                </>
              ) : (
                "Aprobar"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo de rechazo masivo */}
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
            <DialogTitle>Confirmar rechazo masivo</DialogTitle>
            <DialogDescription>
              ¿Estás seguro que deseas rechazar {selectedCount}{" "}
              {selectedCount === 1 ? "elemento" : "elementos"}? Esta acción
              podría eliminar los elementos permanentemente.
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
              onClick={handleBulkReject}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                  Rechazando...
                </>
              ) : (
                "Rechazar"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
