import { PageHeader } from "@/components/common/headers";
import { createAdminClient } from "@/lib/supabase/admin";
import { notFound } from "next/navigation";
import { PartnerInfoDisplay } from "./_components/partner-info-display";
import { Suspense } from "react";
import { PartnerInfoSkeleton } from "./_components/partner-info-skeleton";
import { ProviderBusinessActions } from "./_components/partner-actions";

// Partner data loader component
async function PartnerDataLoader({ partnerId }: { partnerId: string }) {
  const supabase = createAdminClient();

  // Fetch business data
  const { data: business, error } = await supabase
    .from("provider_business")
    .select("*")
    .eq("id", partnerId)
    .single();

  if (error || !business) {
    return notFound();
  }

  // Fetch users associated with this business
  const { data: businessUsers, error: businessUsersError } = await supabase
    .from("provider_business_users")
    .select(
      `*,
      users:user_id (
       *
      )
    `
    )
    .eq("business_id", partnerId);

  if (businessUsersError) {
    console.error("Error fetching business users:", businessUsersError);
  }

  // Fetch GeoJSON data
  let geoJsonData = null;
  let mapCities: any[] = [];
  let mapStates: any[] = [];
  let deliveryZonesFormatted: string[] = [];

  try {
    // Fetch GeoJSON data
    const geoResponse = await fetch(
      "https://raw.githubusercontent.com/angelnmara/geojson/refs/heads/master/MunicipiosMexico.json"
    );
    geoJsonData = await geoResponse.json();

    // Extract states and cities from GeoJSON
    const statesMap = new Map<string, string>();
    const citiesArray: any[] = [];

    if (geoJsonData && geoJsonData.features) {
      geoJsonData.features.forEach((feature: any) => {
        if (feature.properties) {
          const municipio = feature.properties.NAME_2 || "";
          const estado = feature.properties.NAME_1 || "";

          if (!municipio || !estado) return;

          statesMap.set(estado, estado);

          citiesArray.push({
            name: municipio,
            state: estado,
            value: `${municipio}|${estado}`,
          });
        }
      });
    }

    // Convert states to format for the map
    mapStates = Array.from(statesMap.entries()).map(([name]) => ({
      name,
      value: name,
    }));

    mapCities = citiesArray;

    // Format delivery zones for the map component
    if (business.delivery_zones && business.delivery_zones.length > 0) {
      deliveryZonesFormatted = business.delivery_zones.map(
        (zone: { city: string; state: string }) => `${zone.city}|${zone.state}`
      );
    }
  } catch (error) {
    console.error("Error loading GeoJSON data:", error);
  }

  return (
    <PartnerInfoDisplay
      business={business}
      businessUsers={businessUsers || []}
      geoJsonData={geoJsonData}
      mapCities={mapCities}
      mapStates={mapStates}
      deliveryZonesFormatted={deliveryZonesFormatted}
    />
  );
}

const PartnerVerifyPageId = async ({ params }: { params: { id: string } }) => {
  const supabase = createAdminClient();

  // Fetch basic business info for the header
  const { data: businessInfo, error } = await supabase
    .from("provider_business")
    .select("business_name, business_legal_name")
    .eq("id", params.id)
    .single();

  if (error) {
    return notFound();
  }

  return (
    <main className="h-fit w-full md:max-w-[95%] px-3 md:px-0 py-5 pb-14 lg:py-7 mx-auto no-scrollbar">
      <PageHeader
        title="Verificación de partner"
        description={`Visualiza la información de ${
          businessInfo?.business_name || "partner"
        } para verificarlo.`}
      >
        <ProviderBusinessActions id={params.id} />
        {/* Aquí podrías agregar acciones específicas para la verificación */}
      </PageHeader>
      <section className="w-full h-fit items-start justify-start flex flex-col gap-y-5 lg:gap-y-7">
        <Suspense fallback={<PartnerInfoSkeleton />}>
          <PartnerDataLoader partnerId={params.id} />
        </Suspense>
      </section>
    </main>
  );
};

export default PartnerVerifyPageId;
