import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Brand } from "../../page";
import Image from "next/image";

export const InfoBrand = ({ data }: { data: Brand }) => {
  return (
    <Card className="w-full flex-1">
      <CardHeader>
        <CardTitle>Información de la marca</CardTitle>
        <CardDescription>
          Aquí podrás ver la información de la marca
        </CardDescription>
      </CardHeader>
      <CardContent className="bg-sidebar space-y-6">
        {/* Información básica */}
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4 w-full">
          <span className="w-full flex flex-col items-start justify-start gap-y-0">
            <p className="text-sm font-semibold">Nombre:</p>
            <p className="text-xs text-muted-foreground">Nombre de la marca.</p>
          </span>
          <p className="text-sm text-muted-foreground">{data.name}</p>
        </div>

        {data.logo_url && (
          <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4 w-full">
            <span className="w-full flex flex-col items-start justify-start gap-y-0">
              <p className="text-sm font-semibold">Logotipo:</p>
              <p className="text-xs text-muted-foreground">
                Imagen del logotipo.
              </p>
            </span>
            <div className="size-14 items-center justify-center relative overflow-hidden">
              <Image
                src={data.logo_url}
                alt={data.name || "Logo de la marca"}
                fill
                className="object-cover"
              />
            </div>
          </div>
        )}

        {/* Estado */}
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4 w-full">
          <span className="w-full flex flex-col items-start justify-start gap-y-0">
            <p className="text-sm font-semibold">Estado:</p>
            <p className="text-xs text-muted-foreground">
              Estado actual de la marca.
            </p>
          </span>
          <p className="text-sm text-muted-foreground">
            {data.status === "active" ? "Activo" : "En revisión"}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
