"use client";

import { usePathname, useTranslations } from "@/hooks";
import Link from "next/link";
import { Users, House, HeartHandshake } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { paths } from "@/lib/utils/paths";

export function AppSidebar() {
  const pathname = usePathname();
  const tMembros = useTranslations("membros");
  const tFamilias = useTranslations("familias");
  const tMinisterios = useTranslations("ministerios");

  const items = [
    { href: paths.members.list, label: tMembros("titulo"), icon: Users },
    { href: paths.families.list, label: tFamilias("titulo"), icon: House },
    { href: paths.ministries.list, label: tMinisterios("titulo"), icon: HeartHandshake },
  ];

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <span className="px-2 py-1.5 text-sm font-semibold">Plataforma IBBF</span>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navegação</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    isActive={pathname.startsWith(item.href)}
                    render={
                      <Link href={item.href}>
                        <item.icon />
                        <span>{item.label}</span>
                      </Link>
                    }
                  />
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
