import { PageHeader } from "@/components/common/headers";
import { Database } from "@/database.types";
import { createAdminClient } from "@/lib/supabase/admin";
import { notFound } from "next/navigation";
import { InfoCard } from "./_components/info-card";
import { GiftTableActions } from "./_components/gift-table-actions";

export type WeddingVerifySingle =
  Database["public"]["Tables"]["wedding_verify"]["Row"] & {
    wedding: Database["public"]["Tables"]["weddings"]["Row"];
    user: Database["public"]["Tables"]["users"]["Row"];
  };

const GiftTableVerifyPageId = async ({
  params,
}: {
  params: { id: string };
}) => {
  const supabase = createAdminClient();

  const { data: giftTable, error } = await supabase
    .from("wedding_verify")
    .select("*, wedding:weddings(*), user:users(*)")
    .eq("id", params.id)
    .single();

  if (error) {
    return notFound();
  }

  return (
    <main className="h-fit w-full md:max-w-3xl px-3 md:px-0 py-5 pb-14 lg:py-7 mx-auto no-scrollbar">
      <PageHeader
        title="Verificación de mesa"
        description="Visualiza la información de la mesa para verificarla."
      >
        <GiftTableActions id={params.id || ""} />
      </PageHeader>
      <section className="w-full h-fit items-start justify-start flex flex-col gap-y-5 lg:gap-y-7">
        <div className="w-full gap-5 lg:gap-7">
          <InfoCard data={giftTable} />
        </div>
      </section>
    </main>
  );
};

export default GiftTableVerifyPageId;
