import { CardCount } from "@/components/common/cards/card-count";
import { PageHeader } from "@/components/common/headers";
import { DataTable } from "@/components/common/table/data-table";
import { Database } from "@/database.types";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { columns } from "./_components/product-columns";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export type Product = Database["public"]["Views"]["z_products"]["Row"];

const UsersPage = async () => {
  const supabase = await createClient();

  const [
    { data: users, error },
    { count: totalActiveCount },
    { count: totalCount },
  ] = await Promise.all([
    supabase
      .from("z_products")
      .select("*")
      .neq("status", "deleted")
      .neq("status", "rejected"),
    supabase
      .from("z_products")
      .select("*", { count: "exact", head: true })
      .eq("status", "requires_verification"),
    supabase.from("z_products").select("*", { count: "exact", head: true }),
  ]);

  if (error || !users) {
    return notFound();
  }

  return (
    <main className="h-fit w-full md:max-w-[95%] px-3 md:px-0 py-5 pb-14 lg:py-7 mx-auto no-scrollbar">
      <PageHeader
        title="Productos"
        description="Visualiza y administra todos los productos dentro de la plataforma"
      />
      <section className="w-full h-fit items-start justify-start flex flex-col gap-y-5 lg:gap-y-7">
        <div className="grid grid-cols-2 lg:grid-cols-2 gap-4 w-full">
          <CardCount count={totalCount || 0} title="Total de productos" />
          <CardCount
            count={totalActiveCount || 0}
            title="Productos por verificar"
          />
        </div>
        <DataTable
          rowAsLink
          basePath="/dashboard/products"
          columns={columns}
          data={users}
        />
      </section>
    </main>
  );
};

export default UsersPage;
