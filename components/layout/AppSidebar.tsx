"use client";

import { usePathname, useTranslations } from "@/hooks";
import Link from "next/link";
import { Users, House, HeartHandshake } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { paths } from "@/lib/utils/paths";
import { SidebarFooterMenu } from "./SidebarFooterMenu";

export function AppSidebar() {
  const pathname = usePathname();
  const tComum = useTranslations("comum");
  const tMembros = useTranslations("membros");
  const tFamilias = useTranslations("familias");
  const tMinisterios = useTranslations("ministerios");

  const items = [
    { href: paths.members.list, label: tMembros("titulo"), icon: Users },
    { href: paths.families.list, label: tFamilias("titulo"), icon: House },
    { href: paths.ministries.list, label: tMinisterios("titulo"), icon: HeartHandshake },
  ];

  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="h-auto py-3 group-data-[collapsible=icon]:h-20! group-data-[collapsible=icon]:w-8! group-data-[collapsible=icon]:justify-center"
              render={
                <Link href={paths.members.list}>
                  <img
                    src="/logo-igreja.png"
                    alt="Plataforma IBBF"
                    className="h-20 w-auto shrink-0 object-contain group-data-[collapsible=icon]:h-16 dark:hidden"
                  />
                  <img
                    src="/logo-igreja-branca.png"
                    alt="Plataforma IBBF"
                    className="hidden h-20 w-auto shrink-0 object-contain group-data-[collapsible=icon]:h-16 dark:block"
                  />
                  <span className="flex min-w-0 flex-col leading-tight group-data-[collapsible=icon]:hidden">
                    <span className="font-heading truncate text-sm font-bold text-sidebar-foreground">
                      {tComum("nomeIgrejaLinha1")}
                    </span>
                    <span className="font-heading truncate text-xs text-sidebar-foreground/70">
                      {tComum("nomeIgrejaLinha2")}
                    </span>
                  </span>
                </Link>
              }
            />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{tComum("navegacao")}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    isActive={pathname.startsWith(item.href)}
                    tooltip={item.label}
                    className="hover:bg-primary/10 hover:text-primary data-active:bg-primary/10 data-active:text-primary"
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
      <SidebarFooter>
        <SidebarFooterMenu />
      </SidebarFooter>
    </Sidebar>
  );
}
