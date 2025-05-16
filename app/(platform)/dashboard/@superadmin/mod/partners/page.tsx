import { PageHeader } from "@/components/common/headers";
import { DataTable } from "@/components/common/table/data-table";
import { Database } from "@/database.types";
import { createAdminClient } from "@/lib/supabase/admin";
import { columns } from "./_components/partners-mod-columns";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export type Partners = Database["public"]["Tables"]["provider_business"]["Row"];

const PartnersModPAge = async () => {
  const supabase = createAdminClient();

  const [{ data: providers, error }] = await Promise.all([
    supabase
      .from("provider_business")
      .select("*")
      .eq("is_verified", false)
      .order("created_at", { ascending: false }),
  ]);

  return (
    <main className="h-fit w-full md:max-w-[95%] px-3 md:px-0 py-5 pb-14 lg:py-7 mx-auto no-scrollbar">
      <PageHeader
        title="Partners por verificar"
         description="Visualiza y verifica los partners dentro de la plataforma."
      />
      <section className="w-full h-fit items-start justify-start flex flex-col gap-y-5 lg:gap-y-7">
        <DataTable
          rowAsLink
          columns={columns}
          data={providers || []}
          basePath="/dashboard/mod/partners"
          idField="id"
        />
      </section>
    </main>
  );
};

export default PartnersModPAge;
