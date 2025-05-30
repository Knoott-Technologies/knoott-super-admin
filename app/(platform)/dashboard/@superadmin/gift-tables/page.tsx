import { CardCount } from "@/components/common/cards/card-count";
import { PageHeader } from "@/components/common/headers";
import { DataTable } from "@/components/common/table/data-table";
import { Database } from "@/database.types";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { columns } from "./_components/gift-tables-columns";

export type GiftTable = Database["public"]["Views"]["z_weddings"]["Row"];

const GiftTablesPage = async () => {
  // Fetch data from the database
  const supabase = await createClient();

  const [
    { data: giftTables, error },
    { count: totalActiveCount },
    { count: totalClosedCount },
    { count: totalPausedCount },
    { count: totalCount },
  ] = await Promise.all([
    supabase.from("z_weddings").select("*"),
    supabase
      .from("z_weddings")
      .select("*", { count: "exact", head: true })
      .eq("status", "active"),
    supabase
      .from("z_weddings")
      .select("*", { count: "exact", head: true })
      .eq("status", "closed"),
    supabase
      .from("z_weddings")
      .select("*", { count: "exact", head: true })
      .eq("status", "paused"),
    supabase.from("z_weddings").select("*", { count: "exact", head: true }),
  ]);

  if (error || !giftTables) {
    return notFound();
  }

  return (
    <main className="h-fit w-full md:max-w-[95%] px-3 md:px-0 py-5 pb-14 lg:py-7 mx-auto no-scrollbar">
      <PageHeader
        title="Mesas de regalo"
        description="Visualiza y administra todas las mesas de regalo dentro de la plataforma"
      />
      <section className="w-full h-fit items-start justify-start flex flex-col gap-y-5 lg:gap-y-7">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full">
          <CardCount count={totalCount || 0} title="Total de mesas" />
          <CardCount count={totalActiveCount || 0} title="Mesas activas" />
          <CardCount count={totalPausedCount || 0} title="Mesas pausadas" />
          <CardCount count={totalClosedCount || 0} title="Mesas cerradas" />
        </div>
        <DataTable rowAsLink basePath="/dashboard/gift-tables" columns={columns} data={giftTables} />
      </section>
    </main>
  );
};

export default GiftTablesPage;
