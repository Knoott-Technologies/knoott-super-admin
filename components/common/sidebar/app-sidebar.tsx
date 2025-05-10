import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { createClient } from "@/lib/supabase/server";
import { User } from "@supabase/supabase-js";
import { SidebarProfile } from "./sidebar-profile";
import { Database } from "@/database.types";

export async function AppSidebar({
  user,
  role,
  children,
}: {
  user: User;
  role: Database["public"]["Enums"]["admin_role"];
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  return (
    <Sidebar variant="sidebar" collapsible="icon">
      <SidebarHeader>
        <SidebarProfile role={role} user={user} />
      </SidebarHeader>
      <SidebarContent className="no-scrollbar">{children}</SidebarContent>
      <SidebarFooter className="bg-background border-t p-2 pb-8 md:pb-2"></SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
