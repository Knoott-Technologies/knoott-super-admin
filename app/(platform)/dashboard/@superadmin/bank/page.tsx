import { PageHeader } from "@/components/common/headers";
import { DataTable } from "@/components/common/table/data-table";
import { Database } from "@/database.types";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { columns } from "./_components/bank-columns";

export type Transaction =
  Database["public"]["Views"]["z_knoott_transactions"]["Row"];

const GiftTablesPage = async () => {
  // Fetch data from the database
  const supabase = await createClient();

  const [{ data: giftTables, error }] = await Promise.all([
    supabase
      .from("z_knoott_transactions")
      .select("*")
      .order("created_at", { ascending: false }),
  ]);

  if (error || !giftTables) {
    return notFound();
  }

  return (
    <main className="h-fit w-full md:max-w-[95%] px-3 md:px-0 py-5 pb-14 lg:py-7 mx-auto no-scrollbar">
      <PageHeader
        title="Estado de cuenta"
        description="Visualiza y administra las finanzas de la plataforma."
      />
      <section className="w-full h-fit items-start justify-start flex flex-col gap-y-5 lg:gap-y-7">
        <DataTable columns={columns} data={giftTables} />
      </section>
    </main>
  );
};

export default GiftTablesPage;
