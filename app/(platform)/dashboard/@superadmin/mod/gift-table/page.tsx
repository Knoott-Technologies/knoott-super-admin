import { PageHeader } from "@/components/common/headers";
import { DataTable } from "@/components/common/table/data-table";
import { Database } from "@/database.types";
import { createAdminClient } from "@/lib/supabase/admin";
import { columns } from "./_components/gift-table-mod-columns";

export type WeddingVerify =
  Database["public"]["Tables"]["wedding_verify"]["Row"] & {
    wedding: Database["public"]["Tables"]["weddings"]["Row"];
  };

const GiftTableModPage = async () => {
  const supabase = createAdminClient();

  const [{ data: giftTables, error }] = await Promise.all([
    supabase
      .from("wedding_verify")
      .select("*, wedding:weddings(*)")
      .in("status", ["pending", "on_revision"])
      .order("created_at", { ascending: false }),
  ]);

  return (
    <main className="h-fit w-full md:max-w-[95%] px-3 md:px-0 py-5 pb-14 lg:py-7 mx-auto no-scrollbar">
      <PageHeader
        title="Mesas por verificar"
        description="Visualiza y administra las mesas de regalo de la plataforma."
      />
      <section className="w-full h-fit items-start justify-start flex flex-col gap-y-5 lg:gap-y-7">
        <DataTable
          rowAsLink
          columns={columns}
          data={giftTables || []}
          basePath="/dashboard/mod/gift-table"
          idField="id"
        />
      </section>
    </main>
  );
};

export default GiftTableModPage;
