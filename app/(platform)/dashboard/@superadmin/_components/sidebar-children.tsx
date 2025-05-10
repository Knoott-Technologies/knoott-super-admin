"use client";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { SidebarGroupType } from "@/lib/sidebar-types";
import {
  Box,
  FileChartPie,
  Gem,
  LayoutDashboard,
  List,
  Shield,
  Store,
  Tag,
  UserCog2,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const sidebarContent: SidebarGroupType[] = [
  {
    items: [
      {
        label: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
      },
      {
        label: "Moderación",
        href: "/dashboard/moderation",
        icon: Shield,
      },
    ],
  },
  {
    label: "Finanzas",
    items: [
      {
        label: "Estado de cuenta",
        href: "/dashboard/bank",
        icon: FileChartPie,
      },
    ],
  },
  {
    label: "Vista",
    items: [
      {
        label: "Mesas de regalo",
        href: "/dashboard/gift-tables",
        icon: Gem,
      },
      {
        label: "Negocios",
        href: "/dashboard/partners",
        icon: Store,
      },
      {
        label: "Usuarios",
        href: "/dashboard/users",
        icon: Users,
      },
    ],
  },
  {
    label: "Catálogo",
    items: [
      {
        label: "Productos",
        href: "/dashboard/products",
        icon: Box,
      },
      {
        label: "Categorias",
        href: "/dashboard/categories",
        icon: List,
      },
      {
        label: "Marcas",
        href: "/dashboard/brands",
        icon: Tag,
      },
    ],
  },
  {
    label: "Configuración",
    items: [
      {
        label: "Personal",
        href: "/dashboard/personal",
        icon: UserCog2,
      },
    ],
  },
];

export const SidebarChildren = () => {
  const pathname = usePathname();

  return sidebarContent.map((group, i) => (
    <SidebarGroup key={i}>
      {group.label && <SidebarGroupLabel>{group.label}</SidebarGroupLabel>}
      <SidebarGroupContent>
        <SidebarMenu>
          {group.items.map((item, i) => (
            <SidebarMenuItem key={i}>
              <SidebarMenuButton
                asChild
                isActive={
                  (item.href === "/dashboard" && pathname === "/dashboard") ||
                  pathname.startsWith(item.href)
                }
              >
                <Link href={item.href} prefetch>
                  <item.icon />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  ));
};
