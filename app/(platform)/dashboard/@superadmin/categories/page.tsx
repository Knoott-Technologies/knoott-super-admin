import { PageHeader } from "@/components/common/headers";
import { DataTable } from "@/components/common/table/data-table";
import { Database } from "@/database.types";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { columns } from "./_components/categories-columns";
import { CardCount } from "@/components/common/card-count";

export type Category =
  Database["public"]["Views"]["z_catalog_collections"]["Row"];

const CategoriesPage = async () => {
  // Fetch data from the database
  const supabase = await createClient();

  const [
    { data: users, error },
    { count: totalOnRevisionCount },
    { count: totalCount },
  ] = await Promise.all([
    supabase.from("z_catalog_collections").select("*"),
    supabase
      .from("z_catalog_collections")
      .select("*", { count: "exact", head: true })
      .eq("status", "on_revision"),
    supabase.from("z_catalog_collections").select("*", { count: "exact", head: true }),
  ]);

  if (error || !users) {
    return notFound();
  }

  return (
    <main className="h-fit w-full md:max-w-[95%] px-3 md:px-0 py-5 pb-14 lg:py-7 mx-auto no-scrollbar">
      <PageHeader
        title="Categorias"
        description="Visualiza y administra todas las categorías dentro de la plataforma"
      />
      <section className="w-full h-fit items-start justify-start flex flex-col gap-y-5 lg:gap-y-7">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full">
          <CardCount count={totalCount || 0} title="Total de categorias" />
          <CardCount count={totalOnRevisionCount || 0} title="Por revisar" />
        </div>
        <DataTable columns={columns} data={users} />
      </section>
    </main>
  );
};

export default CategoriesPage;
