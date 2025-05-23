import { PageHeader } from "@/components/common/headers";
import { DataTable } from "@/components/common/table/data-table";
import type { Database } from "@/database.types";
import { createAdminClient } from "@/lib/supabase/admin";
import { columns } from "./_components/brands-mod-columns";
import { bulkApproveBrands, bulkRejectBrands } from "@/app/actions/mod-actions";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export type Brand = Database["public"]["Views"]["z_catalog_brands"]["Row"];

const PartnersModPAge = async () => {
  const supabase = createAdminClient();

  const [{ data: providers, error }] = await Promise.all([
    supabase.from("catalog_brands").select("*").eq("status", "on_revision"),
  ]);

  return (
    <main className="h-fit w-full md:max-w-[95%] px-3 md:px-0 py-5 pb-14 lg:py-7 mx-auto no-scrollbar">
      <PageHeader
        title="Marcas por verificar"
        description="Visualiza y verifica las marcas dentro de la plataforma."
      />
      <section className="w-full h-fit items-start justify-start flex flex-col gap-y-5 lg:gap-y-7">
        <DataTable
          rowAsLink
          columns={columns}
          data={providers || []}
          basePath="/dashboard/mod/brands"
          idField="id"
          enableRowSelection={true}
          enableBulkActions={true}
          entityType="brands"
          bulkApproveAction={bulkApproveBrands}
          bulkRejectAction={bulkRejectBrands}
        />
      </section>
    </main>
  );
};

export default PartnersModPAge;
