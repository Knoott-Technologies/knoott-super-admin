"use client";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuBadge,
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
  ListTree,
  Shield,
  Store,
  Tag,
  UserCog2,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const SidebarChildren = ({
  count,
}: {
  count: {
    tables: number;
    partners: number;
    products: number;
    categories: number;
    brands: number;
  };
}) => {
  const pathname = usePathname();

  const sidebarContent: SidebarGroupType[] = [
    {
      items: [
        {
          label: "Dashboard",
          href: "/dashboard",
          icon: LayoutDashboard,
        }
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
          label: "Partners",
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
      label: "Moderación",
      items: [
        {
          label: "Mesas de regalos",
          href: "/dashboard/mod/gift-table",
          icon: Gem,
          count: count.tables,
        },
        {
          label: "Partners",
          href: "/dashboard/mod/partners",
          icon: Store,
          count: count.partners,
        },
        {
          label: "Productos",
          href: "/dashboard/mod/products",
          icon: Box,
          count: count.products,
        },
        {
          label: "Categorías",
          href: "/dashboard/mod/categories",
          icon: ListTree,
          count: count.categories,
        },
        {
          label: "Marcas",
          href: "/dashboard/mod/brands",
          icon: Tag,
          count: count.brands,
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

  return sidebarContent.map((group, i) => (
    <SidebarGroup key={i}>
      {group.label && <SidebarGroupLabel>{group.label}</SidebarGroupLabel>}
      <SidebarGroupContent>
        <SidebarMenu>
          {group.items.map((item, i) => (
            <SidebarMenuItem key={i}>
              <SidebarMenuButton
                tooltip={item.label}
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
              {(item.count && (
                <SidebarMenuBadge className="bg-background ring-1 ring-border text-[11px]">
                  {item.count}
                </SidebarMenuBadge>
              )) ||
                (item.count === 0 && (
                  <SidebarMenuBadge className="bg-background ring-1 ring-border text-[11px]">
                    0
                  </SidebarMenuBadge>
                ))}
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  ));
};
