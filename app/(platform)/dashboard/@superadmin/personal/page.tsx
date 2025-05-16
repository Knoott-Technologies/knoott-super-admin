import { PageHeader } from "@/components/common/headers";
import { DataTable } from "@/components/common/table/data-table";
import { Database } from "@/database.types";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { columns } from "./_components/personal-columns";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export type Users = Database["public"]["Tables"]["users"]["Row"];

const PersonalPAge = async () => {
  // Fetch data from the database
  const supabase = await createClient();

  const [{ data: users, error }] = await Promise.all([
    supabase.from("users").select("*").not("role", "is", null),
  ]);

  if (error || !users) {
    return notFound();
  }

  return (
    <main className="h-fit w-full md:max-w-[95%] px-3 md:px-0 py-5 pb-14 lg:py-7 mx-auto no-scrollbar">
      <PageHeader
        title="Personal Knoott"
        description="Visualiza y administra el personal que administra la plataforma"
      >
        <Button variant="defaultBlack" size={"default"} asChild>
          <Link href={"/dashboard/personal/new"}>
            Agregar <Plus />
          </Link>
        </Button>
      </PageHeader>
      <section className="w-full h-fit items-start justify-start flex flex-col gap-y-5 lg:gap-y-7">
        <DataTable columns={columns} data={users} />
      </section>
    </main>
  );
};

export default PersonalPAge;
