import DateRangeSelector from "@/components/common/date-range-selector";
import { PageHeaderWithLogoBack } from "@/components/common/headers";
import { createAdminClient } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";
import { AmountCard, CardCount } from "@/components/common/cards/card-count";
import { DataTable } from "@/components/common/table/data-table";
import { Database } from "@/database.types";
import { columns } from "./_components/contribution-columns";

export type Contributions =
  Database["public"]["Tables"]["payment_intents"]["Row"] & {
    wedding: Database["public"]["Tables"]["weddings"]["Row"];
  };

const ProviderBusinessDashboardPage = async ({
  params,
}: {
  params: { id: string };
}) => {
  const supabase = createAdminClient();

  // Run all queries in parallel using Promise.all
  const [userInfoResult, userBehaviorResult, userContributionsResult] =
    await Promise.all([
      supabase.from("users").select("*").eq("id", params.id).single(),
      supabase.from("z_users").select("*").eq("id", params.id).single(),
      supabase
        .from("payment_intents")
        .select("*, wedding:weddings(*)")
        .eq("user_id", params.id)
        .order("created_at", { ascending: false }),
    ]);

  const { data: userInfo, error } = userInfoResult;
  const { data: userBehavior } = userBehaviorResult;
  const { data: userContributions } = userContributionsResult;

  if (!userInfo || !userBehavior || error) {
    redirect("/");
  }

  return (
    <main className="h-fit w-full md:max-w-[95%] px-3 md:px-0 py-5 pb-14 lg:py-7 mx-auto no-scrollbar">
      <PageHeaderWithLogoBack
        title={userInfo.first_name + " " + userInfo.last_name}
        description="Esta es tu vista general, aqui podrás ver la información mas relevante de tu negocio."
      >
        <DateRangeSelector />
      </PageHeaderWithLogoBack>

      <section className="w-full h-fit items-start justify-start flex flex-col gap-y-5 lg:gap-y-7">
        <div className="w-full h-fit grid grid-cols-1 md:grid-cols-1 xl:grid-cols-3 gap-4">
          <AmountCard
            amount={userBehavior.total_contribution_amount || 0}
            title="Total contribuido"
          />
          <CardCount
            count={userBehavior.total_contribution || 0}
            title="Contribuciones"
          />
          <AmountCard
            amount={userBehavior.ticket_promedio || 0}
            title="Ticket promedio"
          />
        </div>
        <DataTable
          data={userContributions || []}
          columns={columns}
          rowAsLink
          basePath="/dashboard/users/contributions"
        />
      </section>
    </main>
  );
};

export default ProviderBusinessDashboardPage;
