import { HeaderPlatform } from "@/components/common/header/header-platform";
import { SidebarBox } from "@/components/common/sidebar/sidebar-box";
import { SidebarProvider } from "@/components/ui/sidebar";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { SidebarChildren } from "./_components/sidebar-children";
import { ModSidebar } from "@/components/common/sidebar/mod-sidebar";
import { createAdminClient } from "@/lib/supabase/admin";

const SuperadminLayout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/");
  }

  const admin = createAdminClient();

  const [
    { count: tables, error },
    { count: partners, error: errorPartners },
    { count: products, error: errorProducts },
    { count: categories, error: errorCategories },
    { count: brands, error: errorBrands },
  ] = await Promise.all([
    admin
      .from("wedding_verify")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending"),
    admin
      .from("z_provider_business")
      .select("*", { count: "exact", head: true })
      .eq("status", false),
    admin
      .from("z_products")
      .select("*", { count: "exact", head: true })
      .eq("status", "requires_verification"),
    admin
      .from("z_catalog_collections")
      .select("*", { count: "exact", head: true })
      .eq("status", "on_revision"),
    admin
      .from("z_catalog_brands")
      .select("*", { count: "exact", head: true })
      .eq("status", "on_revision"),
  ]);

  if (
    error ||
    errorPartners ||
    errorProducts ||
    errorCategories ||
    errorBrands ||
    !tables ||
    !partners ||
    !products ||
    !categories ||
    !brands
  ) {
    throw error;
  }

  return (
    <SidebarProvider>
      <ModSidebar role="superadmin" user={user}>
        <SidebarChildren
          count={{ brands, categories, products, partners, tables }}
        />
      </ModSidebar>
      <SidebarBox>
        <HeaderPlatform />
        {children}
      </SidebarBox>
    </SidebarProvider>
  );
};

export default SuperadminLayout;
