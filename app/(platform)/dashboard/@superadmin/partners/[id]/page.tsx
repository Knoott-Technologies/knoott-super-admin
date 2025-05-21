import { TotalProductsCard } from "@/components/common/cards/total-products-card";
import { TotalTransactionsCard } from "@/components/common/cards/total-transaction-card";
import { TotalTransactionsNumber } from "@/components/common/cards/total-transaction-number";
import DateRangeSelector from "@/components/common/date-range-selector";
import { PageHeaderWithLogoBack } from "@/components/common/headers";
import { createAdminClient } from "@/lib/supabase/admin";
import { endOfWeek, format, parse, startOfWeek } from "date-fns";
import { es } from "date-fns/locale";
import { redirect } from "next/navigation";
import TransactionChart from "./_components/transaction-chart";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DataTable } from "@/components/common/table/data-table";
import { columns } from "./_components/transactions-columns";
import { OrdersTable } from "./_components/orders-table";

const ProviderBusinessDashboardPage = async ({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: {
    fromDate?: string;
    toDate?: string;
    page?: string;
    pageSize?: string;
  };
}) => {
  const supabase = createAdminClient();

  // Obtener las fechas desde los searchParams o usar valores predeterminados
  let fromDate, toDate;

  try {
    if (searchParams.fromDate && searchParams.toDate) {
      fromDate = parse(searchParams.fromDate, "yyyy-MM-dd", new Date());
      toDate = parse(searchParams.toDate, "yyyy-MM-dd", new Date());
    } else {
      fromDate = startOfWeek(new Date(), { locale: es });
      toDate = endOfWeek(new Date(), { locale: es });
    }
  } catch (e) {
    // Si hay error en el formato, usar fechas predeterminadas
    fromDate = startOfWeek(new Date(), { locale: es });
    toDate = endOfWeek(new Date(), { locale: es });
  }

  // Formatear para la consulta de Supabase (ISO string)
  const fromDateStr = format(fromDate, "yyyy-MM-dd'T00:00:00Z'");
  const toDateStr = format(toDate, "yyyy-MM-dd'T23:59:59Z'");

  // Get pagination parameters
  const page = Number.parseInt(searchParams.page || "1", 10);
  const pageSize = Number.parseInt(searchParams.pageSize || "10", 10);

  // Calculate range for Supabase
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  // Run all queries in parallel using Promise.all
  const [
    businessResult,
    totalProductsResult,
    totalTransactionsResult,
    transactionsResult,
    transactionsResult2,
    ordersCountResult,
    ordersResult,
  ] = await Promise.all([
    supabase.from("provider_business").select("*").eq("id", params.id).single(),
    supabase
      .from("products")
      .select("*", { count: "exact", head: true })
      .eq("provider_business_id", params.id),
    supabase
      .from("provider_business_transactions")
      .select("*", { count: "exact", head: true })
      .eq("provider_business_id", params.id),
    supabase
      .from("provider_business_transactions")
      .select("*")
      .eq("provider_business_id", params.id)
      .gte("created_at", fromDateStr)
      .lte("created_at", toDateStr)
      .order("created_at", { ascending: false }),
    supabase
      .from("provider_business_transactions")
      .select("*")
      .eq("provider_business_id", params.id)
      .order("created_at", { ascending: false }),
    // Get count of orders for pagination
    supabase
      .from("wedding_product_orders")
      .select("*", { count: "exact", head: true })
      .eq("provider_business_id", params.id),
    // Get paginated orders with all related data
    supabase
      .from("wedding_product_orders")
      .select(
        "*, address:wedding_addresses(*), client:users!wedding_product_orders_ordered_by_fkey(*), provider_shipped_user:users!wedding_product_orders_shipped_ordered_by_fkey(*), provider_user:users!wedding_product_orders_confirmed_by_fkey(*), product:wedding_products!wedding_product_orders_product_id_fkey(id, variant:products_variant_options(*, variant_list:products_variants(*)), product_info:products(*, brand:catalog_brands(*), subcategory:catalog_collections(*)))"
      )
      .eq("provider_business_id", params.id)
      .range(from, to)
      .order("created_at", { ascending: false }),
  ]);

  const { data: business, error } = businessResult;
  const { count: totalProducts } = totalProductsResult;
  const { count: totalTransactions } = totalTransactionsResult;
  const { data: transactions } = transactionsResult;
  const { data: transactions2 } = transactionsResult2;
  const { count: ordersCount } = ordersCountResult;
  const { data: orders } = ordersResult;

  if (!business || error) {
    redirect("/");
  }

  return (
    <main className="h-fit w-full md:max-w-[95%] px-3 md:px-0 py-5 pb-14 lg:py-7 mx-auto no-scrollbar">
      <PageHeaderWithLogoBack
        logo={business.business_logo_url}
        title={business.business_name}
        description="Esta es tu vista general, aqui podrás ver la información mas relevante de tu negocio."
      >
        <DateRangeSelector />
      </PageHeaderWithLogoBack>

      <section className="w-full h-fit items-start justify-start flex flex-col gap-y-5 lg:gap-y-7">
        <div className="w-full h-fit grid grid-cols-1 md:grid-cols-1 xl:grid-cols-3 gap-4">
          <TotalTransactionsCard
            business={business}
            transactions={transactions}
          />
          <TotalTransactionsNumber total={totalTransactions} />
          <TotalProductsCard total={totalProducts} />
        </div>
        <TransactionChart data={transactions} />
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Órdenes</CardTitle>
            <CardDescription>
              Todas las órdenes de este partner.
            </CardDescription>
          </CardHeader>
          <CardContent className="bg-sidebar">
            <OrdersTable
              orders={orders || []}
              totalCount={ordersCount || 0}
              currentPage={page}
              pageSize={pageSize}
            />
          </CardContent>
        </Card>
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Transacciones</CardTitle>
            <CardDescription>
              Todas las transacciones realizadas de este partner.
            </CardDescription>
          </CardHeader>
          <CardContent className="bg-sidebar">
            <DataTable data={transactions2 || []} columns={columns} />
          </CardContent>
        </Card>
      </section>
    </main>
  );
};

export default ProviderBusinessDashboardPage;
