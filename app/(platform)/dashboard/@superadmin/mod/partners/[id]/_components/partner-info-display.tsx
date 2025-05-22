"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Linkedin,
  MapPin,
  Phone,
  Mail,
  Globe,
  FileText,
  Building,
  CreditCard,
  User,
  Calendar,
  CheckCircle,
  XCircle,
  ExternalLink,
} from "lucide-react";
import dynamic from "next/dynamic";
import type { FeatureCollection } from "geojson";
import { Skeleton } from "@/components/ui/skeleton";
import { Tiktok } from "@/components/common/svgs/icons";
import Link from "next/link";

// Dynamically import the map component with SSR disabled
const DeliveryMapClient = dynamic(() => import("./partner-delivery-map"), {
  ssr: false,
  loading: () => (
    <Card className="border">
      <CardContent className="p-0 overflow-hidden">
        <Skeleton className="h-auto aspect-square w-full" />
      </CardContent>
    </Card>
  ),
});

interface PartnerInfoDisplayProps {
  business: any;
  businessUsers: any[];
  geoJsonData: FeatureCollection | null;
  mapCities: any[];
  mapStates: any[];
  deliveryZonesFormatted: string[];
}

export function PartnerInfoDisplay({
  business,
  businessUsers,
  geoJsonData,
  mapCities,
  mapStates,
  deliveryZonesFormatted,
}: PartnerInfoDisplayProps) {
  const [activeTab, setActiveTab] = useState("general");

  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/Link";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("es-MX", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  // Group delivery zones by state for display
  const groupedDeliveryZones: Record<string, string[]> =
    business.delivery_zones?.reduce(
      (
        acc: Record<string, string[]>,
        zone: { city: string; state: string }
      ) => {
        if (!acc[zone.state]) {
          acc[zone.state] = [];
        }
        acc[zone.state].push(zone.city);
        return acc;
      },
      {} as Record<string, string[]>
    ) || {};

  return (
    <div className="w-full space-y-5 lg:space-y-7">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 md:grid-cols-5 mb-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="banking">Bancaria</TabsTrigger>
          <TabsTrigger value="address">Dirección</TabsTrigger>
          <TabsTrigger value="delivery">Zonas de entrega</TabsTrigger>
          <TabsTrigger value="users" className="hidden md:inline-flex">
            Usuarios
          </TabsTrigger>
        </TabsList>

        {/* Información general */}
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Información general</CardTitle>
              <CardDescription>Información general del partner</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 bg-sidebar">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-shrink-0">
                  {business.business_logo_url ? (
                    <div className="relative w-32 h-32 rounded-lg overflow-hidden border">
                      <Image
                        src={business.business_logo_url || "/placeholder.svg"}
                        alt={business.business_name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-32 h-32 rounded-lg bg-muted flex items-center justify-center">
                      <Building className="h-12 w-12 text-muted-foreground" />
                    </div>
                  )}
                </div>

                <div className="flex-1 space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold">
                      {business.business_name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {business.business_legal_name}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="px-2 py-1">
                        {business.business_sector || "Sin sector"}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        Registrado: {formatDate(business.created_at)}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {business.main_phone_number && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          {business.main_phone_number}
                        </span>
                      </div>
                    )}

                    {business.contact_phone_number && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          {business.contact_phone_number} (Contacto)
                        </span>
                      </div>
                    )}

                    {business.main_email && (
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{business.main_email}</span>
                      </div>
                    )}

                    {business.website_url && (
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-muted-foreground" />
                        <Link
                          href={business.website_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline flex items-center"
                        >
                          {business.website_url}
                          <ExternalLink className="h-3 w-3" />
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {business.description && (
                <div className="pt-4 border-t">
                  <h4 className="text-sm font-medium mb-2">Descripción</h4>
                  <p className="text-sm text-muted-foreground whitespace-pre-line">
                    {business.description}
                  </p>
                </div>
              )}

              {business.tax_situation_url && (
                <div className="pt-4 border-t">
                  <h4 className="text-sm font-medium mb-2">Documentos</h4>
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <Link
                      href={business.tax_situation_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-contrast hover:underline items-center flex gap-x-2"
                    >
                      Constancia de situación fiscal
                      <ExternalLink className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              )}

              {business.social_media &&
                Object.values(business.social_media).some(Boolean) && (
                  <div className="pt-4 border-t">
                    <h4 className="text-sm font-medium mb-2">Redes sociales</h4>
                    <div className="flex flex-wrap gap-3">
                      {business.social_media.facebook && (
                        <Link
                          href={`https://facebook.com/${business.social_media.facebook}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-sm hover:underline"
                        >
                          <Facebook className="h-4 w-4 text-blue-600" />
                          <span>Facebook</span>
                        </Link>
                      )}

                      {business.social_media.instagram && (
                        <Link
                          href={`https://instagram.com/${business.social_media.instagram}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-sm hover:underline"
                        >
                          <Instagram className="h-4 w-4 text-pink-600" />
                          <span>Instagram</span>
                        </Link>
                      )}

                      {business.social_media.twitter && (
                        <Link
                          href={`https://twitter.com/${business.social_media.twitter}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-sm hover:underline"
                        >
                          <Twitter className="h-4 w-4 text-sky-500" />
                          <span>Twitter</span>
                        </Link>
                      )}

                      {business.social_media.youtube && (
                        <Link
                          href={`https://youtube.com/c/${business.social_media.youtube}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-sm hover:underline"
                        >
                          <Youtube className="h-4 w-4 text-red-600" />
                          <span>YouTube</span>
                        </Link>
                      )}

                      {business.social_media.linkedin && (
                        <Link
                          href={`https://linkedin.com/company/${business.social_media.linkedin}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-sm hover:underline"
                        >
                          <Linkedin className="h-4 w-4 text-blue-700" />
                          <span>LinkedIn</span>
                        </Link>
                      )}

                      {business.social_media.tiktok && (
                        <Link
                          href={`https://tiktok.com/@${business.social_media.tiktok}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-sm hover:underline"
                        >
                          <Tiktok className="h-5 w-5 text-black" />
                          <span>TikTok</span>
                        </Link>
                      )}
                    </div>
                  </div>
                )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Información bancaria */}
        <TabsContent value="banking" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Información bancaria</CardTitle>
              <CardDescription>Datos bancarios del partner</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 bg-sidebar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Razón social</h4>
                  <p className="text-sm text-muted-foreground">
                    {business.business_legal_name || "No especificada"}
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Comisión</h4>
                  <p className="text-sm text-muted-foreground">
                    {typeof business.commission_percentage === "number"
                      ? `${(business.commission_percentage * 100).toFixed(2)}%`
                      : "No especificada"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Banco</h4>
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      {business.bank_name || "No especificado"}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Cuenta CLABE</h4>
                  <p className="text-sm text-muted-foreground font-mono">
                    {business.bank_account_number
                      ? business.bank_account_number
                          .replace(/(\d{4})/g, "$1 ")
                          .trim()
                      : "No especificada"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Dirección */}
        <TabsContent value="address" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Dirección del establecimiento</CardTitle>
              <CardDescription>Ubicación física del partner</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 bg-sidebar">
              <div className="flex items-start gap-2">
                <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm">
                    {business.street} {business.external_number}
                    {business.internal_number
                      ? `, Int. ${business.internal_number}`
                      : ""}
                  </p>
                  <p className="text-sm">
                    Col. {business.neighborhood}, C.P. {business.postal_code}
                  </p>
                  <p className="text-sm">
                    {business.city}, {business.state},{" "}
                    {business.country || "México"}
                  </p>
                </div>
              </div>

              {/* Aquí se podría agregar un mapa estático con la ubicación si se tiene la latitud y longitud */}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Zonas de entrega */}
        <TabsContent value="delivery" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Zonas de entrega</CardTitle>
              <CardDescription>
                Áreas donde el partner realiza entregas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 overflow-hidden grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-7">
              {/* Mapa de zonas de entrega */}
              {geoJsonData && (
                <div className="aspect-square w-full flex-1">
                  <DeliveryMapClient
                    value={deliveryZonesFormatted}
                    geoJsonData={geoJsonData}
                  />
                </div>
              )}

              {/* Lista de zonas de entrega */}
              <div className="flex-1 overflow-y-auto flex flex-col items-start justify-start gap-y-4">
                {Object.keys(groupedDeliveryZones).length > 0 ? (
                  Object.entries(groupedDeliveryZones).map(
                    ([state, cities]) => (
                      <div key={state} className="w-full border-t-0 gap-y-2">
                        <div className="flex flex-col gap-y-1.5">
                          <h3 className="text-sm font-medium">{state}</h3>
                        </div>
                        <div className="flex flex-col">
                          <div className="flex flex-wrap gap-1">
                            {cities.map((city) => (
                              <Badge
                                key={`${city}-${state}`}
                                variant="outline"
                                className="text-xs"
                              >
                                {city}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    )
                  )
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No hay zonas de entrega especificadas
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Usuarios */}
        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Usuarios asociados</CardTitle>
              <CardDescription>
                Usuarios con acceso a este partner
              </CardDescription>
            </CardHeader>
            <CardContent className="bg-sidebar">
              {businessUsers && businessUsers.length > 0 ? (
                <div className="space-y-4">
                  {businessUsers.map((businessUser) => (
                    <div
                      key={businessUser.id}
                      className="flex items-start gap-3 p-3 border rounded-md"
                    >
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                        <User className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-medium">
                            {businessUser.users?.full_name ||
                              businessUser.users?.email ||
                              "Usuario"}
                          </h4>
                          <Badge
                            variant={
                              businessUser.role === "owner"
                                ? "default"
                                : "outline"
                            }
                            className="text-xs"
                          >
                            {businessUser.role === "owner"
                              ? "Propietario"
                              : "Colaborador"}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {businessUser.users?.email}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No hay usuarios asociados a este partner
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
