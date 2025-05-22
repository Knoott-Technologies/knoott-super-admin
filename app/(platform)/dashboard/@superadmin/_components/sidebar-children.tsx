"use client";

import { SheetClose } from "@/components/ui/sheet";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { SidebarGroupType } from "@/lib/sidebar-types";
import {
  BanknoteArrowDown,
  BanknoteArrowUp,
  Box,
  CreditCard,
  Gem,
  LayoutDashboard,
  List,
  ListTree,
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
    pendingWithdrawals: number;
    pendingPayments: number;
  };
}) => {
  const pathname = usePathname();
  const isMobile = useIsMobile();

  const sidebarContent: SidebarGroupType[] = [
    {
      items: [
        {
          label: "Dashboard",
          href: "/dashboard",
          icon: LayoutDashboard,
        },
      ],
    },
    {
      label: "Finanzas",
      items: [
        {
          label: "Knoott Main Account",
          href: "/dashboard/main-bank",
          icon: CreditCard,
        },
        {
          label: "Knoott Commission Account",
          href: "/dashboard/commission-bank",
          icon: CreditCard,
        },
      ],
    },
    {
      label: "Administración de cuenta",
      items: [
        {
          label: "Retiros",
          href: "/dashboard/withdrawals",
          icon: BanknoteArrowDown,
          count: count.pendingWithdrawals,
        },
        {
          label: "Pagos a Partners",
          href: "/dashboard/partner-payments",
          icon: BanknoteArrowUp,
          count: count.pendingPayments,
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
              {(isMobile && (
                <SheetClose asChild>
                  <SidebarMenuButton
                    tooltip={item.label}
                    asChild
                    isActive={
                      (item.href === "/dashboard" &&
                        pathname === "/dashboard") ||
                      pathname.startsWith(item.href)
                    }
                  >
                    <Link href={item.href} prefetch>
                      <item.icon />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SheetClose>
              )) || (
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
              )}
              {(item.count && (
                <SidebarMenuBadge className="bg-destructive/10 ring-1 ring-destructive/50 text-[11px] text-destructive">
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
