import { HeaderPlatform } from "@/components/common/header/header-platform";
import { AppSidebar } from "@/components/common/sidebar/app-sidebar";
import { SidebarBox } from "@/components/common/sidebar/sidebar-box";
import { SidebarProvider } from "@/components/ui/sidebar";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { SidebarChildren } from "./_components/sidebar-children";
import { createAdminClient } from "@/lib/supabase/admin";

const SuperadminLayout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const supabase = await createClient();
  const admin = createAdminClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/");
  }

  const [
    { count: tables, error },
    { count: partners, error: errorPartners },
    { count: products, error: errorProducts },
    { count: categories, error: errorCategories },
    { count: brands, error: errorBrands },
    { count: pendingWithdrawals, error: errorPendingWithdrawals },
    { count: pendingPayments, error: errorPendingPayments },
  ] = await Promise.all([
    admin
      .from("wedding_verify")
      .select("*", { count: "exact", head: true })
      .in("status", ["pending", "on_revision"]),
    admin
      .from("z_provider_business")
      .select("*", { count: "exact", head: true })
      .eq("status", false)
      .neq("rejected_reason", null),
    admin
      .from("z_products")
      .select("*", { count: "exact", head: true })
      .eq("status", "requires_verification")
      .eq("partner_verified", true),
    admin
      .from("z_catalog_collections")
      .select("*", { count: "exact", head: true })
      .eq("status", "on_revision"),
    admin
      .from("z_catalog_brands")
      .select("*", { count: "exact", head: true })
      .eq("status", "on_revision"),
    admin
      .from("wedding_transactions")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending")
      .eq("type", "egress"),
    admin
      .from("wedding_product_orders")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending"),
  ]);

  return (
    <SidebarProvider>
      <AppSidebar role="superadmin" user={user}>
        <SidebarChildren
          count={{
            brands: brands! as number,
            categories: categories! as number,
            products: products! as number,
            partners: partners! as number,
            tables: tables! as number,
            pendingWithdrawals: pendingWithdrawals! as number,
            pendingPayments: pendingPayments! as number,
          }}
        />
      </AppSidebar>
      <SidebarBox>
        <HeaderPlatform />
        {children}
      </SidebarBox>
    </SidebarProvider>
  );
};

export default SuperadminLayout;
