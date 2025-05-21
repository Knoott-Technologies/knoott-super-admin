import { PageHeaderBackButton } from "@/components/common/headers";
import { Database } from "@/database.types";
import { createAdminClient } from "@/lib/supabase/admin";
import { notFound } from "next/navigation";
import { ContributionDetails } from "./_components/contribution-details";
import { Stripe } from "stripe";
import { ContributionProducts } from "./_components/contribution-products";
import { WeddingDetails } from "./_components/wedding-details";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  typescript: true,
});

export type Contribution =
  Database["public"]["Tables"]["payment_intents"]["Row"] & {
    cart: Database["public"]["Tables"]["user_carts"]["Row"] & {
      cart_items: Database["public"]["Tables"]["cart_items"]["Row"][] & {
        product: Database["public"]["Tables"]["wedding_products"]["Row"] | null;
        gift_card: Database["public"]["Tables"]["gift_cards"]["Row"] | null;
      };
    };
    user: Database["public"]["Tables"]["users"]["Row"];
    wedding: Database["public"]["Tables"]["weddings"]["Row"];
  };

const ContributionPage = async ({ params }: { params: { id: string } }) => {
  const supabase = createAdminClient();

  const { data: contribution, error } = await supabase
    .from("payment_intents")
    .select(
      "*, cart:user_carts(*, cart_items:cart_items(*, product:wedding_products(*), gift_card:gift_cards(*))), user:users(*), wedding:weddings(*)"
    )
    .eq("id", params.id)
    .order("created_at", { ascending: false })
    .single();

  if (error || !contribution) {
    return notFound();
  }

  const stripePaymentIntent = await stripe.paymentIntents.retrieve(
    contribution.payment_intent_id
  );

  const paymentMethod = await stripe.paymentMethods.retrieve(
    stripePaymentIntent.payment_method as string
  );

  return (
    <main className="h-fit w-full md:max-w-[95%] px-3 md:px-0 py-5 pb-14 lg:py-7 mx-auto no-scrollbar">
      <PageHeaderBackButton
        title={"Contribución" + " " + "#" + params.id}
        description="Aquí puedes ver los detalles de la contribución."
      />

      <section className="w-full h-fit items-start justify-start grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-5 lg:gap-7">
        <ContributionDetails
          payment_intent={stripePaymentIntent}
          payment_method={paymentMethod}
          contribution={contribution}
        />
        <div className="w-full h-fit items-start justify-start flex flex-col gap-y-5 lg:gap-y-7">
          <WeddingDetails contribution={contribution} />
          <ContributionProducts contribution={contribution} />
        </div>
      </section>
    </main>
  );
};

export default ContributionPage;
