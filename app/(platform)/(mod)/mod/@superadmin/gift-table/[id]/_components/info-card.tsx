import { Database } from "@/database.types";
import { WeddingVerifySingle } from "../page";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";

export const InfoCard = ({
  data,
}: {
  data: Omit<WeddingVerifySingle, "wedding" | "user">;
}) => {
  return (
    <Card className="w-full flex-1">
      <CardHeader>
        <CardTitle>Información proporcionada</CardTitle>
        <CardDescription>
          Esta es la información proporcionada por el usuario para su
          verificación.
        </CardDescription>
      </CardHeader>
      <CardContent className="bg-sidebar flex flex-col gap-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4 w-full">
          <span className="w-full flex flex-col items-start justify-start gap-y-0">
            <p className="text-sm font-semibold">Nombre completo:</p>
            <p className="text-xs text-muted-foreground">
              Nombre completo del usuario. (Debe coincidir con el del documento)
            </p>
          </span>
          <p className="text-sm text-muted-foreground">{data.full_name}</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4 w-full">
          <span className="w-full flex flex-col items-start justify-start gap-y-0">
            <p className="text-sm font-semibold">Tipo de documento:</p>
            <p className="text-xs text-muted-foreground">
              El tipo de documento que proporciono el usuario. (Debe coincidir
              con el del documento enviado)
            </p>
          </span>
          <p className="text-sm text-muted-foreground capitalize">
            {data.document_type}
          </p>
        </div>
        {(data.document_type === "ine" && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4 w-full">
              <span className="w-full flex flex-col items-start justify-start gap-y-0">
                <p className="text-sm font-semibold">
                  Foto documento (Frente):
                </p>
                <p className="text-xs text-muted-foreground">
                  Foto del frente del documento proporcionado por el usuario.
                </p>
              </span>
              <div className="w-full aspect-[3/4] relative overflow-hidden border bg-background">
                <Image
                  src={data.document_front_url}
                  alt={data.full_name}
                  fill
                  className="object-contain"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4 w-full">
              <span className="w-full flex flex-col items-start justify-start gap-y-0">
                <p className="text-sm font-semibold">
                  Foto documento (Reverso):
                </p>
                <p className="text-xs text-muted-foreground">
                  Foto del reverso del documento proporcionado por el usuario.
                </p>
              </span>
              <div className="w-full aspect-[3/4] relative overflow-hidden border bg-background">
                <Image
                  src={data.document_back_url!}
                  alt={data.full_name}
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          </>
        )) || (
          <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4 w-full">
            <span className="w-full flex flex-col items-start justify-start gap-y-0">
              <p className="text-sm font-semibold">Foto documento:</p>
              <p className="text-xs text-muted-foreground">
                Foto del documento proporcionado por el usuario.
              </p>
            </span>
            <div className="w-full aspect-[3/4] relative overflow-hidden border bg-background">
              <Image
                src={data.document_front_url}
                alt={data.full_name}
                fill
                className="object-contain"
              />
            </div>
          </div>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4 w-full">
          <span className="w-full flex flex-col items-start justify-start gap-y-0">
            <p className="text-sm font-semibold">Foto del usuario:</p>
            <p className="text-xs text-muted-foreground">
              Foto del rostro proporcionado por el usuario.
            </p>
          </span>
          <div className="w-full aspect-[3/4] relative overflow-hidden border bg-background">
            <Image
              src={data.selfie_url}
              alt={data.full_name}
              fill
              className="object-contain"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
