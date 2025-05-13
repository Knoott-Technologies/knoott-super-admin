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
import { Box, Gem, LayoutDashboard, ListTree, Store, Tag } from "lucide-react";
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
          href: "/mod/dashboard",
          icon: LayoutDashboard,
        },
      ],
    },
    {
      label: "Moderación",
      items: [
        {
          label: "Mesas de regalos",
          href: "/mod/gift-table",
          icon: Gem,
          count: count.tables,
        },
        {
          label: "Partners",
          href: "/mod/partners",
          icon: Store,
          count: count.partners,
        },
        {
          label: "Productos",
          href: "/mod/products",
          icon: Box,
          count: count.products,
        },
        {
          label: "Categorías",
          href: "/mod/categories",
          icon: ListTree,
          count: count.categories,
        },
        {
          label: "Marcas",
          href: "/mod/brands",
          icon: Tag,
          count: count.brands,
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
                tooltip={item.label + " " + "-" + " " + item.count}
                size={"default"}
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
              {item.count && (
                <SidebarMenuBadge className="bg-background ring-1 ring-border text-[11px]">
                  {item.count}
                </SidebarMenuBadge>
              )}
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  ));
};
