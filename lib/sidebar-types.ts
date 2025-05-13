import { LucideIcon } from "lucide-react";

export interface SidebarGroupType {
  label?: string;
  items: SidebarGroupItemType[];
}

export interface SidebarGroupItemType {
  label: string;
  href: string;
  icon: LucideIcon;
  count?: number;
}
