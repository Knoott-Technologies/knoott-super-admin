import { PageHeader } from "@/components/common/headers";
import { DataTable } from "@/components/common/table/data-table";
import { Database } from "@/database.types";
import { createAdminClient } from "@/lib/supabase/admin";
import { columns } from "./_components/withdrawal-columns";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export type Withdrawal =
  Database["public"]["Tables"]["wedding_transactions"]["Row"] & {
    user: Database["public"]["Tables"]["users"]["Row"];
    wedding: Database["public"]["Tables"]["weddings"]["Row"];
  };

const WithdrawalsPage = async () => {
  const supabase = createAdminClient();

  const [{ data: withdrawals, error }] = await Promise.all([
    supabase
      .from("wedding_transactions")
      .select("*, user:users(*), wedding:weddings(*)")
      .eq("status", "pending")
      .eq("type", "egress")
      .order("created_at", { ascending: false }),
  ]);

  return (
    <main className="h-fit w-full md:max-w-[95%] px-3 md:px-0 py-5 pb-14 lg:py-7 mx-auto no-scrollbar">
      <PageHeader
        title="Retiros pendientes"
        description="Visualiza y administra todos los retiros pendientes por realizar."
      />
      <section className="w-full h-fit items-start justify-start flex flex-col gap-y-5 lg:gap-y-7">
        <DataTable columns={columns} data={withdrawals || []} />
      </section>
    </main>
  );
};

export default WithdrawalsPage;
