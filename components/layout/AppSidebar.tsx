"use client";

import { usePathname, useTranslations, useFinanceMe } from "@/hooks";
import Link from "next/link";
import { Users, House, HeartHandshake, Wallet, BookOpen, Music, ListMusic } from "lucide-react";
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
  const tFinanceiro = useTranslations("financeiro");
  const tConteudo = useTranslations("conteudo");
  const finance = useFinanceMe();

  // Financeiro só aparece para quem tem papel financeiro (ou atribui papéis, que entra direto nas configurações).
  const financeHref = finance.canRead ? paths.finance.dashboard : finance.canManageRoles ? paths.finance.settings : null;

  const items = [
    { href: paths.members.list, label: tMembros("titulo"), icon: Users, match: paths.members.list },
    { href: paths.families.list, label: tFamilias("titulo"), icon: House, match: paths.families.list },
    { href: paths.ministries.list, label: tMinisterios("titulo"), icon: HeartHandshake, match: paths.ministries.list },
    ...(financeHref
      ? [{ href: financeHref, label: tFinanceiro("titulo"), icon: Wallet, match: paths.finance.dashboard }]
      : []),
  ];

  // Conteúdo de uso diário de toda a igreja: fica em destaque, separado da gestão.
  const contentItems = [
    { href: paths.bible, label: tConteudo("biblia"), icon: BookOpen },
    { href: paths.hymns.list, label: tConteudo("hinario"), icon: Music },
    { href: paths.canticles.list, label: tConteudo("canticos"), icon: ListMusic },
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
                    isActive={pathname.startsWith(item.match)}
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
        <SidebarGroup className="mt-auto">
          <div className="rounded-xl border border-primary/15 bg-primary/5 p-1 group-data-[collapsible=icon]:border-0 group-data-[collapsible=icon]:bg-transparent group-data-[collapsible=icon]:p-0">
            <SidebarGroupLabel className="text-primary/80">{tConteudo("palavraELouvor")}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {contentItems.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      isActive={pathname.startsWith(item.href)}
                      tooltip={item.label}
                      className="hover:bg-primary/10 hover:text-primary data-active:bg-primary/15 data-active:text-primary"
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
          </div>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarFooterMenu />
      </SidebarFooter>
    </Sidebar>
  );
}
