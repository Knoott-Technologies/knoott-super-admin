import { PageHeader } from "@/components/common/headers";
import { DataTable } from "@/components/common/table/data-table";
import { Database } from "@/database.types";
import { createAdminClient } from "@/lib/supabase/admin";
import { columns } from "./_components/partner-payment-columns";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export type PartnerPayment =
  Database["public"]["Tables"]["wedding_product_orders"]["Row"] & {
    provider: Database["public"]["Tables"]["provider_business"]["Row"];
  };

const WithdrawalsPage = async () => {
  const supabase = createAdminClient();

  const [{ data: withdrawals, error }] = await Promise.all([
    supabase
      .from("wedding_product_orders")
      .select("*, provider:provider_business(*)")
      .eq("status", "pending")
      .order("created_at", { ascending: false }),
  ]);

  return (
    <main className="h-fit w-full md:max-w-[95%] px-3 md:px-0 py-5 pb-14 lg:py-7 mx-auto no-scrollbar">
      <PageHeader
        title="Pagos a Partners pendientes"
        description="Visualiza y administra todos los retiros pendientes por realizar."
      />
      <section className="w-full h-fit items-start justify-start flex flex-col gap-y-5 lg:gap-y-7">
        <DataTable columns={columns} data={withdrawals || []} />
      </section>
    </main>
  );
};

export default WithdrawalsPage;
