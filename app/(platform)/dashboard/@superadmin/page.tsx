import { AmountCard, CardCount } from "@/components/common/cards/card-count";
import { PageHeader } from "@/components/common/headers";
import { createAdminClient } from "@/lib/supabase/admin";
import TransactionChartDashboard from "./_components/transaction-chart";
import DateRangeSelector from "@/components/common/date-range-selector";
import { parse, format, startOfWeek, endOfWeek } from "date-fns";
import { es } from "date-fns/locale";

const DashboardPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  const supabase = await createAdminClient();

  // Obtener parámetros de fecha de la URL
  const fromDateParam = searchParams.fromDate as string | undefined;
  const toDateParam = searchParams.toDate as string | undefined;
  const typeParam = searchParams.type as string | undefined;

  // Establecer fechas predeterminadas si no se proporcionan
  let fromDate = startOfWeek(new Date(), { locale: es });
  let toDate = endOfWeek(new Date(), { locale: es });

  // Parsear fechas de los parámetros si existen
  if (fromDateParam) {
    try {
      fromDate = parse(fromDateParam, "yyyy-MM-dd", new Date());
    } catch (error) {
      console.error("Error parsing fromDate", error);
    }
  }

  if (toDateParam) {
    try {
      toDate = parse(toDateParam, "yyyy-MM-dd", new Date());
    } catch (error) {
      console.error("Error parsing toDate", error);
    }
  }

  // Formatear fechas para la consulta SQL
  const fromDateFormatted = format(fromDate, "yyyy-MM-dd");
  const toDateFormatted = format(toDate, "yyyy-MM-dd");

  // Construir la consulta base para transacciones
  let transactionsQuery = supabase
    .from("z_knoott_transactions")
    .select("*")
    .gte("created_at", `${fromDateFormatted}T00:00:00`)
    .lte("created_at", `${toDateFormatted}T23:59:59`);

  // Añadir filtro por tipo si está presente
  if (typeParam && typeParam !== "all") {
    transactionsQuery = transactionsQuery.eq("type", typeParam);
  }

  const [
    { data: balance },
    { count: pendingWithdrawals },
    { count: pendingOrders },
    { count: activeWeddings },
    { data: transactions },
    { count: pendingConfirmOrders}
  ] = await Promise.all([
    supabase
      .from("z_knoott_account_summary")
      .select("*")
      .eq("account", "Knoott Main Account")
      .single(),
    supabase
      .from("wedding_transactions")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending")
      .eq("type", "egress"),
    supabase
      .from("wedding_product_orders")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending"),
    supabase
      .from("weddings")
      .select("*", { count: "exact", head: true })
      .eq("status", "active"),
    transactionsQuery,
    supabase
      .from("wedding_product_orders")
      .select("*", { count: "exact", head: true })
      .eq("status", "requires_confirmation"),
  ]);

  return (
    <main className="h-fit w-full md:max-w-[95%] px-3 md:px-0 py-5 pb-14 lg:py-7 mx-auto no-scrollbar">
      <PageHeader
        title="Dashboard"
        description="Información general de la plataforma"
      >
        <DateRangeSelector />
      </PageHeader>
      <section className="w-full h-fit items-start justify-start flex flex-col gap-y-5 lg:gap-y-7">
        <div className="w-full h-fit grid grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5 gap-5 lg:gap-7 ease-in-out transition-all duration-300">
          <AmountCard
            href="/dashboard/main-bank"
            amount={balance?.current_balance || 0}
            title="Balance actual"
          />
          <CardCount
            href={`/dashboard/gift-tables`}
            count={activeWeddings || 0}
            title="Mesas activas"
          />
          <CardCount
            href="/dashboard/withdrawals"
            destructive={
              pendingWithdrawals && pendingWithdrawals > 0 ? true : false
            }
            count={pendingWithdrawals || 0}
            title="Retiros pendientes"
          />
          <CardCount
            href="/dashboard/partner-payments"
            destructive={pendingOrders && pendingOrders > 0 ? true : false}
            count={pendingOrders || 0}
            title="Pagos pendientes"
          />
          <CardCount
            href="/dashboard/partners"
            warning={pendingConfirmOrders && pendingConfirmOrders > 0 ? true : false}
            count={pendingConfirmOrders || 0}
            title="Órdenes por confirmar"
          />
        </div>
        <TransactionChartDashboard data={transactions} />
      </section>
    </main>
  );
};

export default DashboardPage;
