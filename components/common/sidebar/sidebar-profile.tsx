"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar";
import { Database } from "@/database.types";
import { User } from "@supabase/supabase-js";
import { formatInTimeZone } from "date-fns-tz";
import { es } from "date-fns/locale";
import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  ChevronsUpDown,
  LayoutDashboard,
  LogOut,
  X,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { createClient } from "@/lib/supabase/client";
import { cn, getRoleClassNames } from "@/lib/utils";

export const SidebarProfile = ({
  user,
  role,
}: {
  user: User;
  role: Database["public"]["Enums"]["admin_role"];
}) => {
  const { state, isMobile } = useSidebar();
  const isCollapsed = !isMobile && state === "collapsed";
  const supabase = createClient();
  const router = useRouter();
  const [sheetOpen, setSheetOpen] = useState(false);
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  async function signOut() {
    await supabase.auth.signOut({ scope: "local" }).then(() => {
      if (isMobile) {
        setSheetOpen(false); // Close the sheet before redirecting
      }
      router.refresh();
    });
  }

  // Content shared between dropdown and drawer
  const ProfileContent = () => (
    <>
      <div className="flex flex-col gap-0 items-start justify-start bg-sidebar w-full max-w-full overflow-hidden border-b p-3">
        <p className="mb-1 w-full">Mi cuenta</p>
        <p className="truncate font-medium w-full text-lg">
          {user.user_metadata.first_name + " " + user.user_metadata.last_name}
        </p>
        <p className="truncate text-sm text-muted-foreground w-full">
          {user.email}
        </p>
      </div>

      {/* <div className="p-1">
        <Button
          variant={"ghost"}
          className="w-full justify-between text-muted-foreground mb-1"
          asChild
        >
          <Link
            href={`/settings/${user.id}/profile`}
            className="flex items-center justify-between w-full"
            onClick={() => isMobile && setSheetOpen(false)}
          >
            <span className="truncate">Mi Perfil</span>
            <ArrowRight className="!size-3.5 flex-shrink-0 ml-2" />
          </Link>
        </Button>
      </div> */}

      <div className="p-1 pb-8 md:pb-3">
        <Button
          variant={"ghost"}
          onClick={signOut}
          className="w-full justify-between text-destructive hover:bg-destructive/10 hover:text-destructive"
        >
          <span className="truncate">Cerrar sesión</span>
          <LogOut className="!size-3.5 ml-auto flex-shrink-0" />
        </Button>
      </div>
    </>
  );

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        {isMobile ? (
          // Mobile: Use Sheet (Drawer) component
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <SidebarMenuButton
                tooltip={
                  user.user_metadata.first_name +
                  " " +
                  user.user_metadata.last_name
                }
                className="flex items-center gap-2"
                variant={"outline"}
              >
                <Avatar className="size-6 rounded-none">
                  <AvatarFallback
                    className={cn(
                      "text-xs rounded-none border",
                      getRoleClassNames(role)
                    )}
                  >
                    {user.user_metadata.first_name[0] +
                      user.user_metadata.last_name[0]}
                  </AvatarFallback>
                </Avatar>
                <span className="flex-1 text-left max-w-[80%] truncate">
                  {user.user_metadata.first_name} {user.user_metadata.last_name}
                </span>
                <ChevronsUpDown className="!size-3.5" />
              </SidebarMenuButton>
            </SheetTrigger>
            <SheetContent
              side="bottom"
              className="p-0 overflow-auto max-h-[85vh]"
            >
              <ProfileContent />
            </SheetContent>
          </Sheet>
        ) : (
          // Desktop: Use DropdownMenu
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                tooltip={
                  user.user_metadata.first_name +
                  " " +
                  user.user_metadata.last_name
                }
                className={cn(
                  "flex items-center gap-2",
                  isCollapsed && "justify-center p-0 h-8 w-8"
                )}
                variant={"outline"}
              >
                <Avatar
                  className={cn("size-6 rounded-none", isCollapsed && "size-8")}
                >
                  <AvatarFallback
                    className={cn(
                      "text-xs rounded-none border",
                      isCollapsed && "border-0",
                      getRoleClassNames(role)
                    )}
                  >
                    {user.user_metadata.first_name[0] +
                      user.user_metadata.last_name[0]}
                  </AvatarFallback>
                </Avatar>
                {!isCollapsed && (
                  <>
                    <span className="flex-1 text-left max-w-[80%] truncate">
                      {user.user_metadata.first_name +
                        " " +
                        user.user_metadata.last_name}
                    </span>
                    <ChevronDown className="size-3.5" />
                  </>
                )}
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              side={isCollapsed ? "right" : "bottom"}
              align={isCollapsed ? "start" : "start"}
              className={cn(
                "flex flex-col p-0",
                isCollapsed
                  ? "min-w-[300px]"
                  : "w-[--radix-popper-anchor-width]"
              )}
            >
              <DropdownMenuGroup className="bg-sidebar p-1 border-b">
                <DropdownMenuLabel>
                  <span className="flex flex-col gap-0 items-start justify-start w-full max-w-full overflow-hidden">
                    <p className="mb-1 w-full">Mi cuenta</p>
                    <p className="truncate font-normal w-full">
                      {user.user_metadata.first_name +
                        " " +
                        user.user_metadata.last_name}
                    </p>
                    <p className="truncate text-xs text-muted-foreground w-full">
                      {user.email}
                    </p>
                  </span>
                </DropdownMenuLabel>
              </DropdownMenuGroup>
              <DropdownMenuGroup className="p-1 pt-0">
                <DropdownMenuItem
                  onClick={signOut}
                  className="text-destructive focus:text-destructive focus:bg-destructive/15"
                >
                  <span className="truncate">Cerrar sesión</span>
                  <LogOut className="!size-3.5 ml-auto flex-shrink-0" />
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </SidebarMenuItem>
    </SidebarMenu>
  );
};
