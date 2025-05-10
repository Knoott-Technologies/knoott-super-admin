import { CardCount } from "@/components/common/card-count";
import { PageHeader } from "@/components/common/headers";
import { DataTable } from "@/components/common/table/data-table";
import { Database } from "@/database.types";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { columns } from "./_components/partners-columns";

export type Partners =
  Database["public"]["Views"]["z_provider_business"]["Row"];

const GiftTablesPage = async () => {
  // Fetch data from the database
  const supabase = await createClient();

  const [
    { data: giftTables, error },
    { count: totalCount },
    { count: totalVerifiedCount },
    { count: totalNonVerifiedCount },
    { data: totalPendingSales },
  ] = await Promise.all([
    supabase.from("z_provider_business").select("*"),
    supabase
      .from("z_provider_business")
      .select("*", { count: "exact", head: true }),
    supabase
      .from("z_provider_business")
      .select("*", { count: "exact", head: true })
      .eq("status", true),
    supabase
      .from("z_provider_business")
      .select("*", { count: "exact", head: true })
      .eq("status", false),
    supabase.from("z_provider_business").select("total_pending_sales"),
  ]);

  if (error || !giftTables) {
    return notFound();
  }

  const totalPendingSalesAmount = totalPendingSales?.reduce(
    (acc, curr) => acc + curr.total_pending_sales,
    0
  );

  return (
    <main className="h-fit w-full md:max-w-[95%] px-3 md:px-0 py-5 pb-14 lg:py-7 mx-auto no-scrollbar">
      <PageHeader
        title="Partners"
        description="Visualiza y administra los partners dentro de la plataforma"
      />
      <section className="w-full h-fit items-start justify-start flex flex-col gap-y-5 lg:gap-y-7">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 w-full">
          <CardCount count={totalCount || 0} title="Total de partners" />
          <CardCount
            count={totalVerifiedCount || 0}
            title="Partners verificados"
          />
          <CardCount
            count={totalNonVerifiedCount || 0}
            title="Partners no verificados"
          />
           <CardCount
            count={totalPendingSalesAmount || 0}
            title="Ventas pendientes"
          />
        </div>
        <DataTable rowAsLink columns={columns} data={giftTables} />
      </section>
    </main>
  );
};

export default GiftTablesPage;
