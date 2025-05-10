import { HeaderPlatform } from "@/components/common/header/header-platform";
import { AppSidebar } from "@/components/common/sidebar/app-sidebar";
import { SidebarBox } from "@/components/common/sidebar/sidebar-box";
import {
  SidebarProvider
} from "@/components/ui/sidebar";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { SidebarChildren } from "./_components/sidebar-children";

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

  return (
    <SidebarProvider>
      <AppSidebar role="superadmin" user={user}>
        <SidebarChildren />
      </AppSidebar>
      <SidebarBox>
        <HeaderPlatform />
        {children}
      </SidebarBox>
    </SidebarProvider>
  );
};

export default SuperadminLayout;
