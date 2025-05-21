import { AmountCard } from "@/components/common/cards/card-count";
import { PageHeader } from "@/components/common/headers";
import { DataTable } from "@/components/common/table/data-table";
import type { Database } from "@/database.types";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { columns } from "./_components/bank-columns";
import DateRangeSelector from "@/components/common/date-range-selector";

export type Transaction =
  Database["public"]["Views"]["z_knoott_commissions"]["Row"];

const GiftTablesPage = async ({
  searchParams,
}: {
  searchParams: { fromDate: string; toDate: string };
}) => {
  // Fetch data from the database
  const supabase = await createClient();

  // Extract date range from search params
  const { fromDate, toDate } = searchParams;

  // Build the query with date filtering if dates are provided
  let commissionsQuery = supabase
    .from("z_knoott_commissions")
    .select("*")
    .order("created_at", { ascending: false });

  // Apply date filters if both dates are provided
  if (fromDate && toDate) {
    // Format dates to ensure they're in the correct format (YYYY-MM-DD)
    const formattedFromDate = new Date(fromDate).toISOString().split("T")[0];
    const formattedToDate = new Date(toDate);
    // Add one day to toDate to include the entire day in the range
    formattedToDate.setDate(formattedToDate.getDate() + 1);
    const formattedToDateString = formattedToDate.toISOString().split("T")[0];

    // Apply date range filter
    commissionsQuery = commissionsQuery
      .gte("created_at", `${formattedFromDate}T00:00:00`)
      .lt("created_at", `${formattedToDateString}T00:00:00`);
  }

  const [{ data: giftTables, error }, { data: balance }] = await Promise.all([
    commissionsQuery,
    supabase
      .from("z_knoott_account_summary")
      .select("*")
      .eq("account", "Knoott Commission Account")
      .single(),
  ]);

  if (error || !giftTables) {
    return notFound();
  }

  // Calculate filtered income if date range is applied
  const filteredIncome =
    fromDate && toDate
      ? giftTables.reduce((sum, item) => sum + (item.amount || 0), 0)
      : balance?.total_income || 0;

  return (
    <main className="h-fit w-full md:max-w-[95%] px-3 md:px-0 py-5 pb-14 lg:py-7 mx-auto no-scrollbar">
      <PageHeader
        title="Knoott Commission Account"
        description="Visualiza y administra las finanzas de la plataforma."
      >
        <DateRangeSelector />
      </PageHeader>
      <section className="w-full h-fit items-start justify-start flex flex-col gap-y-5 lg:gap-y-7">
        <div className="w-full h-fit items-center justify-start grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-7">
          <AmountCard
            amount={
              fromDate && toDate ? filteredIncome : balance?.total_income || 0
            }
            title={fromDate && toDate ? "Ingresos (Filtrados)" : "Ingresos"}
            type="income"
          />
        </div>
        <DataTable columns={columns} data={giftTables} />
      </section>
    </main>
  );
};

export default GiftTablesPage;
