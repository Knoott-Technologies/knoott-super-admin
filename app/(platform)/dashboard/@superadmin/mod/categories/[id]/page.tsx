import { PageHeader, PageHeaderBackButton } from "@/components/common/headers";
import { Database } from "@/database.types";
import { createAdminClient } from "@/lib/supabase/admin";
import { notFound } from "next/navigation";
import { InfoCategory } from "./_components/info-category";
import { CatalogCollectionActions } from "./_components/catalog-collections-actions";

export type Category =
  Database["public"]["Tables"]["catalog_collections"]["Row"] & {
    parent: Database["public"]["Tables"]["catalog_collections"]["Row"] | null;
  };

const CategoryVerifyPage = async ({ params }: { params: { id: string } }) => {
  const supabase = createAdminClient();

  // Paso 1: Obtener la categoría principal
  const { data: category, error } = await supabase
    .from("catalog_collections")
    .select("*")
    .eq("id", params.id)
    .single();

  if (error || !category) {
    console.error("Error al obtener la categoría:", error);
    return notFound();
  }

  // Paso 2: Si tiene parent_id, obtener el padre
  let parentCategory = null;
  if (category.parent_id) {
    const { data: parent, error: parentError } = await supabase
      .from("catalog_collections")
      .select("*")
      .eq("id", category.parent_id)
      .single();

    if (!parentError && parent) {
      parentCategory = parent;
    } else {
      console.log("Error al obtener el padre o no existe:", parentError);
    }
  }

  // Combinar los resultados
  const categoryWithParent: Category = {
    ...category,
    parent: parentCategory,
  };

  return (
    <main className="h-fit w-full md:max-w-3xl px-3 md:px-0 py-5 pb-14 lg:py-7 mx-auto no-scrollbar">
      <PageHeaderBackButton
        title="Verificación de categoría"
        description="Visualiza la información de la categoría para verificarla."
      >
        <CatalogCollectionActions id={params.id || ""} />
      </PageHeaderBackButton>
      <section className="w-full h-fit items-start justify-start flex flex-col gap-y-5 lg:gap-y-7">
        <div className="w-full gap-5 lg:gap-7">
          <InfoCategory data={categoryWithParent} />
        </div>
      </section>
    </main>
  );
};

export default CategoryVerifyPage;
