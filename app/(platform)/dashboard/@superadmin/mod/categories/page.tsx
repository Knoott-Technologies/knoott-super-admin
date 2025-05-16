import { PageHeader } from "@/components/common/headers";
import { DataTable } from "@/components/common/table/data-table";
import { Database } from "@/database.types";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { columns } from "./_components/categories-mod-columns";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export type Category =
  Database["public"]["Views"]["z_catalog_collections"]["Row"];

const CategoriesModPage = async () => {
  // Fetch data from the database
  const supabase = await createClient();

  const [{ data: users, error }] = await Promise.all([
    supabase
      .from("z_catalog_collections")
      .select("*")
      .eq("status", "on_revision"),
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
        <DataTable
          rowAsLink
          basePath="/dashboard/mod/categories"
          idField="id"
          columns={columns}
          data={users}
        />
      </section>
    </main>
  );
};

export default CategoriesModPage;
