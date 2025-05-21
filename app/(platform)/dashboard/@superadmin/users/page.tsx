import { PageHeader } from "@/components/common/headers";
import { DataTable } from "@/components/common/table/data-table";
import { Database } from "@/database.types";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { columns } from "./_components/user_columns";
import { CardCount } from "@/components/common/cards/card-count";

export type Users = Database["public"]["Views"]["z_users"]["Row"];

const UsersPage = async () => {
  // Fetch data from the database
  const supabase = await createClient();

  const [
    { data: users, error },
    { count: totalUsers },
    { count: totalGifted },
    { count: totalTable },
    { count: totalPartner },
  ] = await Promise.all([
    supabase.from("z_users").select("*"),
    supabase.from("z_users").select("*", { count: "exact", head: true }),
    supabase
      .from("z_users")
      .select("*", { count: "exact", head: true })
      .eq("has_gifted", true),
    supabase
      .from("z_users")
      .select("*", { count: "exact", head: true })
      .eq("has_table", true),
    supabase
      .from("z_users")
      .select("*", { count: "exact", head: true })
      .eq("is_provider", true),
    // supabase
    //   .from("z_users")
    //   .select("*", { count: "exact", head: true })
    //   .eq("status", "active"),
    // supabase
    //   .from("z_users")
    //   .select("*", { count: "exact", head: true })
    //   .eq("status", "closed"),
    // supabase
    //   .from("z_users")
    //   .select("*", { count: "exact", head: true })
    //   .eq("status", "paused"),
    // supabase.from("z_users").select("*", { count: "exact", head: true }),
  ]);

  if (error || !users) {
    return notFound();
  }

  return (
    <main className="h-fit w-full md:max-w-[95%] px-3 md:px-0 py-5 pb-14 lg:py-7 mx-auto no-scrollbar">
      <PageHeader
        title="Usuarios"
        description="Visualiza y administra los usuarios dentro de la plataforma"
      />
      <section className="w-full h-fit items-start justify-start flex flex-col gap-y-5 lg:gap-y-7">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full">
          <CardCount count={totalUsers || 0} title="Total de usuarios" />
          <CardCount count={totalGifted || 0} title="Usuarios invitados" />
          <CardCount count={totalTable || 0} title="Usuarios con mesa" />
          <CardCount count={totalPartner || 0} title="Usuarios partners" />
        </div>
        <DataTable
          rowAsLink
          basePath="/dashboard/users"
          columns={columns}
          data={users}
        />
      </section>
    </main>
  );
};

export default UsersPage;
