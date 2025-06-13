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
import { Database } from "@/database.types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowUpRight, MapIcon, Minus } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
    supabase
      .from("weddings")
      .select(
        "*, users:user_weddings(*, user:users(*)), addresses:wedding_addresses(*)"
      )
      .eq("id", weddingId)
      .eq("addresses.is_default", true)
      .single(),
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
          <Button asChild variant={"outline"} size={"sm"}>
            <Link href={`https://knoott.com/${wedding.id}`} target="_blank">
              {" "}
              Ver boda <ArrowUpRight />
            </Link>
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

        <Card className="w-full">
          <CardHeader>
            <CardTitle>Información general</CardTitle>
            <CardDescription>
              Información general de la mesa de regalos
            </CardDescription>
          </CardHeader>
          <CardContent className="bg-sidebar grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-7">
            <div className="w-full flex-1 items-start justify-start flex flex-col gap-y-4">
              <span className="w-full flex flex-col items-start justify-start gap-y-0">
                <p className="text-sm font-semibold">Usuarios:</p>
                <p className="text-xs text-muted-foreground">
                  Información de los usuarios
                </p>
              </span>
              {wedding.users && (
                <div className="w-full bg-background border p-0">
                  <Table className="w-full">
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nombre</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Teléfono</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {wedding.users.map(
                        (
                          user: Database["public"]["Tables"]["user_weddings"]["Row"] & {
                            user: Database["public"]["Tables"]["users"]["Row"];
                          }
                        ) => (
                          <TableRow key={user.id}>
                            <TableCell>
                              {user.user.first_name + " " + user.user.last_name}
                            </TableCell>
                            <TableCell>{user.user.email}</TableCell>
                            <TableCell>{user.user.phone_number}</TableCell>
                          </TableRow>
                        )
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
            <div className="w-full flex-1 items-start justify-start flex flex-col gap-y-4">
              <span className="w-full flex flex-col items-start justify-start gap-y-0">
                <p className="text-sm font-semibold">Mesa de regalos:</p>
                <p className="text-xs text-muted-foreground">
                  Información de la mesa de regalos:
                </p>
              </span>
              <div className="w-full grid grid-cols-2 lg:grid-cols-3 gap-4 bg-card border p-3 flex-1">
                <span className="w-full flex flex-col gap-y-2 items-start justify-start">
                  <p className="font-semibold text-sm text-foreground">
                    Fecha de creación
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {format(wedding.created_at, "PPP", {
                      locale: es,
                    })}
                  </p>
                </span>
                <span className="w-full flex flex-col gap-y-2 items-start justify-start col-span-2">
                  <p className="font-semibold text-sm text-foreground">
                    Dirección de entrega predeterminada
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {wedding.addresses[0].street_address +
                      ", " +
                      wedding.addresses[0].city +
                      ", " +
                      wedding.addresses[0].state +
                      ", " +
                      wedding.addresses[0].postal_code}{" "}
                    <span>
                      <Tooltip delayDuration={300}>
                        <TooltipTrigger asChild>
                          <Button
                            asChild
                            className="bg-sidebar ml-1 border hover:border-foreground shadow-none cursor-pointer hover:bg-foreground ease-in-out transition-all text-muted-foreground hover:text-background inline-flex h-5 max-h-full items-center rounded px-1 font-[inherit] text-[0.625rem] font-medium"
                          >
                            <Link
                              target="_blank"
                              href={`https://www.google.com/maps/search/?api=1&query=${wedding.addresses[0].street_address}%2C${wedding.addresses[0].city}%2C${wedding.addresses[0].state}%2C${wedding.addresses[0].postal_code}`}
                            >
                              <MapIcon className="!h-3 !w-3" />
                            </Link>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent align="center">
                          <p>Buscar en Google Maps</p>
                        </TooltipContent>
                      </Tooltip>
                    </span>
                  </p>
                </span>
                <span className="w-full flex flex-col gap-y-2 items-start justify-start">
                  <p className="font-semibold text-sm text-foreground">
                    Banco
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {wedding.bank}{" "}
                  </p>
                </span>
                <span className="w-full flex flex-col gap-y-2 items-start justify-start">
                  <p className="font-semibold text-sm text-foreground">
                    Cuenta CLABE
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {wedding.bank_account_number}{" "}
                  </p>
                </span>
                <span className="w-full flex flex-col gap-y-2 items-start justify-start">
                  <p className="font-semibold text-sm text-foreground">
                    Titular de la cuenta
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {wedding.account_holder}{" "}
                  </p>
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

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
