import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Category } from "../page";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export const InfoCategory = ({ data }: { data: Category }) => {
  return (
    <Card className="w-full flex-1">
      <CardHeader>
        <CardTitle>Información de la categoría</CardTitle>
        <CardDescription>
          Aquí podrás ver la información de la categoría
        </CardDescription>
      </CardHeader>
      <CardContent className="bg-sidebar space-y-6">
        {/* Información básica */}
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4 w-full">
          <span className="w-full flex flex-col items-start justify-start gap-y-0">
            <p className="text-sm font-semibold">Nombre:</p>
            <p className="text-xs text-muted-foreground">
              Nombre de la categoría.
            </p>
          </span>
          <p className="text-sm text-muted-foreground">{data.name}</p>
        </div>

        {/* Estado */}
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4 w-full">
          <span className="w-full flex flex-col items-start justify-start gap-y-0">
            <p className="text-sm font-semibold">Estado:</p>
            <p className="text-xs text-muted-foreground">
              Estado actual de la categoría.
            </p>
          </span>
          <p className="text-sm text-muted-foreground">
            {data.status === "active" ? "Activo" : "En revisión"}
          </p>
        </div>

        {/* Descripción si existe */}
        {data.description && (
          <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4 w-full">
            <span className="w-full flex flex-col items-start justify-start gap-y-0">
              <p className="text-sm font-semibold">Descripción:</p>
              <p className="text-xs text-muted-foreground">
                Descripción de la categoría.
              </p>
            </span>
            <p className="text-sm text-muted-foreground">{data.description}</p>
          </div>
        )}

        {/* Información del padre */}
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4 w-full">
          <span className="w-full flex flex-col items-start justify-start gap-y-0">
            <p className="text-sm font-semibold">Categoría padre:</p>
            <p className="text-xs text-muted-foreground">
              Categoría a la que pertenece.
            </p>
          </span>
          <div className="text-sm text-muted-foreground">
            {data.parent ? (
              <div className="flex flex-col gap-1">
                <Link
                  href={`/dashboard/mod/categories/${data.parent.id}`}
                  target="_blank"
                  className="font-medium text-muted-foreground hover:text-foreground ease-in-out underline flex gap-x-.5 "
                >
                  {data.parent.name} <ArrowUpRight className="size-3.5"/>
                </Link>
              </div>
            ) : (
              <p className="italic">Categoría principal (sin padre)</p>
            )}
          </div>
        </div>

        {/* Fechas */}
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4 w-full">
          <span className="w-full flex flex-col items-start justify-start gap-y-0">
            <p className="text-sm font-semibold">Fecha de creación:</p>
            <p className="text-xs text-muted-foreground">
              Fecha en que se creó la categoría.
            </p>
          </span>
          <p className="text-sm text-muted-foreground">
            {new Date(data.created_at).toLocaleDateString("es-MX", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
