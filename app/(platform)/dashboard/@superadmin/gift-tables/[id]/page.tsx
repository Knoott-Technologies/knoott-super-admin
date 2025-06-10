import { GiftCardCard } from "@/components/common/cards/gift-card-card";
import { KnoottCardCash } from "@/components/common/cards/knoott-card-cash";
import { ProductCardList } from "@/components/common/cards/product-card";
import { TotalContributionCard } from "@/components/common/cards/total-contribution-card";
import { TotalGuestsCard } from "@/components/common/cards/total-guest-card";
import { PageHeaderBackButton } from "@/components/common/headers";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import {
    cn,
    getWeddingStatusClassname,
    getWeddingStatusLabel,
} from "@/lib/utils";
import { ContributionTable } from "./_components/contributions-table";
import TransactionChart from "./_components/transactions-card";

const GiftTablePage = async ({ params }: { params: { id: string } }) => {
  const supabase = await createClient();
  const weddingId = params.id;

  // Run all queries in parallel using Promise.all
  const [
    userResponse,
    weddingData,
    transactionsData,
    incomeData,
    giftCardsData,
    productsData,
  ] = await Promise.all([
    supabase.auth.getUser(),
    supabase.from("weddings").select("*").eq("id", weddingId).single(),
    supabase
      .from("wedding_transactions")
      .select("*")
      .eq("wedding_id", weddingId)
      .order("created_at", { ascending: false }),
    supabase
      .from("wedding_transactions")
      .select("*, user:users(*), cart:user_carts(*, items:cart_items(*))")
      .eq("wedding_id", weddingId)
      .eq("type", "income")
      .order("created_at", { ascending: false }),
    supabase
      .from("gift_cards")
      .select("*, user:created_by(*)")
      .eq("wedding_id", weddingId)
      .order("created_at", { ascending: false }),
    supabase
      .from("wedding_products")
      .select(
        `
        *,
        variant:product_variant_option_id(
          *,
          variantGroup:variant_id(*)
        ),
        product:product_id(
          *,
          brand:brand_id(*)
        ),
        user:created_by(*),
        wedding:wedding_id(*)
      `
      )
      .eq("wedding_id", weddingId),
  ]);

  const userRaw = userResponse.data.user;
  const wedding = weddingData.data;
  const transactions = transactionsData.data;
  const income = incomeData.data;
  const giftCards = giftCardsData.data;
  const products = productsData.data;

  const { data: user } = await supabase
    .from("users")
    .select("*")
    .eq("id", userRaw!.id)
    .single();

  if (!wedding) {
    return null;
  }

  return (
    <main className="h-fit w-full md:max-w-[95%] px-3 md:px-0 py-5 pb-14 lg:py-7 mx-auto no-scrollbar">
      <PageHeaderBackButton
        title={wedding.name}
        description={`Visualiza la información de la mesa.`}
      >
        <span className="flex items-center gap-x-1 justify-end">
          <Button
            variant={"outline"}
            size={"sm"}
            className={cn(getWeddingStatusClassname(wedding.status))}
          >
            {getWeddingStatusLabel(wedding.status)}
          </Button>
        </span>
      </PageHeaderBackButton>
      {/* {user?.id && <NextStepsGuide userId={user.id} wedding={wedding} />} */}
      <section className="w-full h-fit items-start justify-start flex flex-col gap-y-5 lg:gap-y-7">
        <div className="w-full h-fit grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <KnoottCardCash wedding={wedding} />
          <TotalContributionCard
            wedding={wedding}
            transactions={income || []}
          />
          <TotalGuestsCard wedding={wedding} transactions={income || []} />
        </div>
        <TransactionChart data={transactions} />
        <ContributionTable data={income} />

        {products && (
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Productos en la mesa de regalos</CardTitle>
              <CardDescription>
                Aquí puedes ver los productos en la mesa de regalos.
              </CardDescription>
            </CardHeader>
            <CardContent className="bg-sidebar">
              <div className="w-full h-fit grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 2xl:grid-cols-6 gap-2">
                {products.map((product) => (
                  <ProductCardList
                    key={product.id}
                    user={user!}
                    data={product}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {giftCards && (
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Tarjetas de regalo en la mesa</CardTitle>
              <CardDescription>
                Aquí puedes ver las tarjetas de regalo en la mesa.
              </CardDescription>
            </CardHeader>
            <CardContent className="bg-sidebar">
              <div className="w-full h-fit grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-2">
                {giftCards.map((giftCard) => (
                  <GiftCardCard
                    weddingId={params.id}
                    key={giftCard.id}
                    data={giftCard}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </section>
    </main>
  );
};

export default GiftTablePage;
