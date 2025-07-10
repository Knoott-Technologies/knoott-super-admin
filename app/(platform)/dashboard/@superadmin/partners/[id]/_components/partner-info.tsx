import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import { Database } from "@/database.types";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

export const PartnerInfo = ({
  business,
}: {
  business: Database["public"]["Tables"]["provider_business"]["Row"];
}) => {
  // Agrupar las zonas de entrega por estado, manejando el caso de null
  const deliveryZones = business.delivery_zones as Array<{
    id: string;
    city: string;
    state: string;
  }> | null;
  const groupedDeliveryZones =
    deliveryZones?.reduce((acc, zone) => {
      const state = zone.state;
      if (!acc[state]) {
        acc[state] = [];
      }
      acc[state].push(zone);
      return acc;
    }, {} as Record<string, Array<{ id: string; city: string; state: string }>>) ||
    {};

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Información general</CardTitle>
        <CardDescription>
          Revisa la información general de este partner.
        </CardDescription>
      </CardHeader>
      <CardContent className="bg-sidebar flex flex-col gap-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-4 items-start justify-start w-full">
          <span className="w-full flex flex-col items-start justify-start gap-y-0">
            <p className="text-sm font-semibold">Nombre:</p>
            <p className="text-xs text-muted-foreground">
              {business.business_name || "No disponible"}
            </p>
          </span>
          <span className="w-full flex flex-col items-start justify-start gap-y-0">
            <p className="text-sm font-semibold">Teléfono Principal:</p>
            <p className="text-xs text-muted-foreground">
              {business.main_phone_number || "No disponible"}
            </p>
          </span>
          <span className="w-full flex flex-col items-start justify-start gap-y-0">
            <p className="text-sm font-semibold">Teléfono de contacto:</p>
            <p className="text-xs text-muted-foreground">
              {business.contact_phone_number || "No disponible"}
            </p>
          </span>
          <span className="w-full flex flex-col items-start justify-start gap-y-0">
            <p className="text-sm font-semibold">Email principal:</p>
            <p className="text-xs text-muted-foreground">
              {business.main_email || "No disponible"}
            </p>
          </span>
          <span className="w-full flex flex-col items-start justify-start gap-y-0">
            <p className="text-sm font-semibold">Giro:</p>
            <p className="text-xs text-muted-foreground">
              {business.business_sector || "No disponible"}
            </p>
          </span>
          <span className="w-full flex flex-col items-start justify-start gap-y-0">
            <p className="text-sm font-semibold">Página web:</p>
            <p className="text-xs text-muted-foreground">
              {business.website_url || "No disponible"}
            </p>
          </span>
          <span className="w-full flex flex-col items-start justify-start gap-y-0">
            <p className="text-sm font-semibold">CSF:</p>
            {business.tax_situation_url ? (
              <Link
                href={business.tax_situation_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-muted-foreground hover:underline"
              >
                Ver documento
              </Link>
            ) : (
              <p className="text-xs text-muted-foreground">No disponible</p>
            )}
          </span>
          <span className="w-full flex flex-col items-start justify-start gap-y-0">
            <p className="text-sm font-semibold">Cuenta CLABE:</p>
            <p className="text-xs text-muted-foreground">
              {business.bank_account_number || "No disponible"}
            </p>
          </span>
          <span className="w-full flex flex-col items-start justify-start gap-y-0">
            <p className="text-sm font-semibold">Banco:</p>
            <p className="text-xs text-muted-foreground">
              {business.bank_name || "No disponible"}
            </p>
          </span>
          <span className="w-full flex flex-col items-start justify-start gap-y-0">
            <p className="text-sm font-semibold">Nombre legal:</p>
            <p className="text-xs text-muted-foreground">
              {business.business_legal_name || "No disponible"}
            </p>
          </span>
          <span className="w-full flex flex-col items-start justify-start gap-y-0 lg:col-span-2">
            <p className="text-sm font-semibold">Dirección:</p>
            <p className="text-xs text-muted-foreground">
              {[
                business.street,
                business.external_number,
                business.neighborhood,
                business.city,
                business.state,
                business.postal_code,
              ]
                .filter(Boolean)
                .join(", ") || "No disponible"}
            </p>
          </span>
        </div>
        <Separator />
        <Collapsible defaultOpen={false} className="group/collapsible">
          <div className="w-full flex flex-col items-start justify-start gap-y-4">
            <div className="flex items-center justify-between w-full gap-x-3">
              <p className="text-sm font-semibold">Zonas de entrega</p>
              <CollapsibleTrigger asChild>
                <Button className="size-7" size={"icon"} variant={"ghost"}>
                  <ChevronRight className="w-4 h-4 group-data-[state=open]/collapsible:rotate-90 ease-in-out duration-300" />
                </Button>
              </CollapsibleTrigger>
            </div>
            <CollapsibleContent className="overflow-auto max-h-[60vh] w-full">
              {Object.keys(groupedDeliveryZones).length > 0 ? (
                <div className="w-full flex flex-col gap-y-4">
                  {Object.entries(groupedDeliveryZones).map(
                    ([state, zones]) => (
                      <div key={state} className="w-full">
                        <p className="text-sm font-medium text-foreground mb-2">
                          {state}
                        </p>
                        <div className="w-full grid grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-2 pl-4">
                          {zones.map((zone) => (
                            <p
                              className="text-xs text-muted-foreground"
                              key={zone.id}
                            >
                              {zone.city}
                            </p>
                          ))}
                        </div>
                      </div>
                    )
                  )}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">
                  No hay zonas de entrega configuradas
                </p>
              )}
            </CollapsibleContent>
          </div>
        </Collapsible>
      </CardContent>
    </Card>
  );
};
