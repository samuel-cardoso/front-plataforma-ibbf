"use client";

import Link from "next/link";
import { usePathname, useTranslations, useFinanceMe } from "@/hooks";
import { cn } from "@/lib/utils";
import { paths } from "@/lib/utils/paths";

export function FinanceNav() {
  const t = useTranslations("financeiro");
  const pathname = usePathname();
  const { canRead, canWrite, canManageRoles } = useFinanceMe();

  const items = [
    { href: paths.finance.dashboard, label: t("painel"), visible: canRead, exact: true },
    { href: paths.finance.transactions, label: t("lancamentos"), visible: canRead },
    { href: paths.finance.periods, label: t("fechamento"), visible: canRead },
    { href: paths.finance.settings, label: t("configuracoes"), visible: canWrite || canManageRoles },
  ].filter((item) => item.visible);

  return (
    <nav className="flex gap-1 overflow-x-auto overflow-y-hidden border-b">
      {items.map((item) => {
        const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "-mb-px border-b-2 px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors",
              active
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
