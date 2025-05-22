import { AmountCard } from "@/components/common/cards/card-count";
import { PageHeader } from "@/components/common/headers";
import { DataTable } from "@/components/common/table/data-table";
import type { Database } from "@/database.types";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { columns } from "./_components/bank-columns";
import DateRangeSelector from "@/components/common/date-range-selector";
import { cn } from "@/lib/utils";
import NumberFlow from "@number-flow/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export type Transaction =
  Database["public"]["Views"]["z_knoott_transactions"]["Row"];

const GiftTablesPage = async ({
  searchParams,
}: {
  searchParams: { fromDate: string; toDate: string };
}) => {
  // Extract date range from search params
  const { fromDate, toDate } = searchParams;

  // Fetch data from the database
  const supabase = await createClient();

  // Build the query with date filtering if dates are provided
  let transactionsQuery = supabase
    .from("z_knoott_transactions")
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
    transactionsQuery = transactionsQuery
      .gte("created_at", `${formattedFromDate}T00:00:00`)
      .lt("created_at", `${formattedToDateString}T00:00:00`);
  }

  const [{ data: giftTables, error }, { data: balance }] = await Promise.all([
    transactionsQuery,
    supabase
      .from("z_knoott_account_summary")
      .select("*")
      .eq("account", "Knoott Main Account")
      .single(),
  ]);

  if (error || !giftTables) {
    return notFound();
  }

  // Calculate filtered values if date range is applied
  let filteredIncome = 0;
  let filteredOutcome = 0;
  let filteredBalance = 0;

  // Group transactions by operation_type
  const operationTypeGroups: Record<string, number> = {};

  if (fromDate && toDate && giftTables.length > 0) {
    // Calculate filtered income and outcome
    giftTables.forEach((transaction) => {
      const operationType = transaction.operation_type || "Otros";

      if (transaction.type === "income") {
        filteredIncome += transaction.amount || 0;
      } else if (transaction.type === "outcome") {
        filteredOutcome += transaction.amount || 0;
        // For outcome, we group by operation_type
        operationTypeGroups[operationType] =
          (operationTypeGroups[operationType] || 0) + (transaction.amount || 0);
      }
    });

    // Calculate filtered balance (income - outcome)
    filteredBalance = filteredIncome - filteredOutcome;
  } else {
    // If no date filter, use the total values and calculate operation type groups from all data
    giftTables.forEach((transaction) => {
      const operationType = transaction.operation_type || "Otros";

      if (transaction.type === "outcome") {
        // For outcome, we group by operation_type
        operationTypeGroups[operationType] =
          (operationTypeGroups[operationType] || 0) + (transaction.amount || 0);
      }
    });
  }

  // Get the total outcome amount for percentage calculations
  const totalOutcome =
    fromDate && toDate ? filteredOutcome : balance?.total_outcome || 0;

  // Sort operation types by amount (descending)
  const sortedOperationTypes = Object.entries(operationTypeGroups)
    .sort(([, amountA], [, amountB]) => Number(amountB) - Number(amountA))
    .map(([type, amount]) => ({
      type,
      amount,
      percentage: totalOutcome > 0 ? (amount / totalOutcome) * 100 : 0,
    }));

  return (
    <main className="h-fit w-full md:max-w-[95%] px-3 md:px-0 py-5 pb-14 lg:py-7 mx-auto no-scrollbar">
      <PageHeader
        title="Knoott Main Account"
        description="Visualiza y administra las finanzas de la plataforma."
      >
        <DateRangeSelector />
      </PageHeader>
      <section className="w-full h-fit items-start justify-start flex flex-col gap-y-5 lg:gap-y-7">
        <div
          className={cn(
            "w-full h-fit grid grid-cols-1 lg:grid-cols-4 gap-5 lg:gap-7 ease-in-out transition-all duration-300"
          )}
        >
          <AmountCard
            amount={balance?.current_balance || 0}
            title="Balance histórico"
          />

          {/* {fromDate && toDate && (
            <AmountCard
              amount={filteredBalance}
              title="Balance del período"
              type={filteredBalance >= 0 ? "income" : "expense"}
            />
          )} */}

          <AmountCard
            amount={
              fromDate && toDate ? filteredIncome : balance?.total_income || 0
            }
            title={
              fromDate && toDate ? "Ingresos del período" : "Ingresos totales"
            }
            type="income"
          />

          <AmountCard
            amount={
              fromDate && toDate ? filteredOutcome : balance?.total_outcome || 0
            }
            title={
              fromDate && toDate ? "Egresos del período" : "Egresos totales"
            }
            type="expense"
          />

          {/* Desglose de egresos por tipo */}
          {sortedOperationTypes.length > 0 && (
            <Card className="flex-1 flex flex-col gap-y-0">
              <CardHeader>
                <CardTitle>Desglose por tipo</CardTitle>
              </CardHeader>
              <CardContent className="bg-sidebar flex flex-col gap-y-1 h-full">
                {sortedOperationTypes.map(({ type, amount, percentage }) => (
                  <div
                    key={type}
                    className="flex items-center justify-between text-sm gap-4"
                  >
                    <span className="text-muted-foreground flex-1 truncate">
                      {type}
                    </span>
                    <div className="flex items-center gap-2 shrink-0">
                      <NumberFlow
                        format={{
                          style: "currency",
                          currency: "MXN",
                          currencyDisplay: "code",
                        }}
                        className="font-medium text-destructive"
                        value={(amount && amount / 100) || 0}
                      />
                      <kbd
                        className={cn(
                          "bg-background inline-flex h-5 items-center border px-1 font-mono text-[10px] font-medium shrink-0"
                        )}
                      >
                        {percentage.toFixed(2)}%
                      </kbd>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        <DataTable columns={columns} data={giftTables} />
      </section>
    </main>
  );
};

export default GiftTablesPage;
