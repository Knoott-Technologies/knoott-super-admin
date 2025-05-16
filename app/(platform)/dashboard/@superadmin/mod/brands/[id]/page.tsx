import { PageHeader, PageHeaderBackButton } from "@/components/common/headers";
import { Database } from "@/database.types";
import { createAdminClient } from "@/lib/supabase/admin";
import { notFound } from "next/navigation";
import { BrandActions } from "./_components/brand-actions";
import { InfoBrand } from "./_components/info-brand";

const CategoryVerifyPage = async ({ params }: { params: { id: string } }) => {
  const supabase = createAdminClient();

  // Paso 1: Obtener la categoría principal
  const { data: category, error } = await supabase
    .from("catalog_brands")
    .select("*")
    .eq("id", params.id)
    .single();

  if (error || !category) {
    console.error("Error al obtener la marca:", error);
    return notFound();
  }

  return (
    <main className="h-fit w-full md:max-w-3xl px-3 md:px-0 py-5 pb-14 lg:py-7 mx-auto no-scrollbar">
      <PageHeaderBackButton
        title="Verificación de marca"
        description="Visualiza la información de la marca para verificarla."
      >
        <BrandActions id={params.id || ""} />
      </PageHeaderBackButton>
      <section className="w-full h-fit items-start justify-start flex flex-col gap-y-5 lg:gap-y-7">
        <div className="w-full gap-5 lg:gap-7">
          <InfoBrand data={category} />
        </div>
      </section>
    </main>
  );
};

export default CategoryVerifyPage;
