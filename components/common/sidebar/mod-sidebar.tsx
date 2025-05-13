import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { User } from "@supabase/supabase-js";
import { Database } from "@/database.types";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SidebarProfile } from "./sidebar-profile";

export async function ModSidebar({
  user,
  role,
  children,
}: {
  user: User;
  role: Database["public"]["Enums"]["admin_role"];
  children: React.ReactNode;
}) {

  return (
    <Sidebar variant="sidebar" collapsible="icon">
      <SidebarHeader>
        <SidebarProfile role={role} user={user} />
      </SidebarHeader>
      <SidebarContent className="no-scrollbar">{children}</SidebarContent>
      <SidebarFooter className="bg-background border-t p-2 pb-8 md:pb-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/dashboard">
                <ArrowLeft /> <span className="ml-auto">Regresar a inicio</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
