"use client";

import { ArrowDownRightIcon, ArrowUpRightIcon, LandmarkIcon, WalletIcon } from "lucide-react";
import { useState, useLocale, useTranslations, useFinanceSummary } from "@/hooks";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { DataLoadErrorState } from "@/components/shared";
import { cn } from "@/lib/utils";
import { formatCents } from "@/lib/utils/format/money";
import { MonthSwitcher, currentYearMonth } from "./MonthSwitcher";

export function FinanceDashboard() {
  const t = useTranslations("financeiro");
  const locale = useLocale();
  const [period, setPeriod] = useState(currentYearMonth);
  const { summary, isLoading, isError, refetch } = useFinanceSummary(period.year, period.month);
  const money = (cents: number) => formatCents(cents, locale);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <MonthSwitcher year={period.year} month={period.month} onChange={setPeriod} />
        {summary && (
          <Badge variant={summary.period.status === "CLOSED" ? "secondary" : "outline"}>
            {summary.period.status === "CLOSED" ? t("mesFechado") : t("mesAberto")}
          </Badge>
        )}
      </div>

      {isLoading && (
        <div className="grid gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }, (_, i) => (
            <Skeleton key={i} className="h-28" />
          ))}
        </div>
      )}
      {!isLoading && isError && <DataLoadErrorState onRetry={refetch} />}

      {summary && (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            <KpiCard
              label={t("entradasDoMes")}
              value={money(summary.month.totalIncomeCents)}
              icon={ArrowUpRightIcon}
              tone="positive"
            />
            <KpiCard
              label={t("saidasDoMes")}
              value={money(summary.month.totalExpenseCents)}
              icon={ArrowDownRightIcon}
              tone="negative"
            />
            <KpiCard label={t("saldoTotal")} value={money(summary.balances.totalCents)} icon={WalletIcon} />
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>{t("saldoPorFundo")}</CardTitle>
                <CardDescription>{t("saldoPorFundoDescricao")}</CardDescription>
              </CardHeader>
              <CardContent>
                <AmountList
                  rows={summary.balances.funds.map((fund) => ({
                    id: fund.id,
                    name: fund.name,
                    amountCents: fund.balanceCents,
                    badge: fund.restricted ? t("restrito") : undefined,
                  }))}
                  money={money}
                  emptyLabel={t("semMovimento")}
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>{t("saldoPorConta")}</CardTitle>
                <CardDescription>{t("saldoPorContaDescricao")}</CardDescription>
              </CardHeader>
              <CardContent>
                <AmountList
                  rows={summary.balances.accounts.map((account) => ({
                    id: account.id,
                    name: account.name,
                    amountCents: account.balanceCents,
                    icon: account.kind === "BANK" ? LandmarkIcon : WalletIcon,
                  }))}
                  money={money}
                  emptyLabel={t("semMovimento")}
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>{t("entradasPorCategoria")}</CardTitle>
              </CardHeader>
              <CardContent>
                <AmountList rows={summary.month.incomeByCategory} money={money} emptyLabel={t("semMovimentoNoMes")} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>{t("saidasPorCategoria")}</CardTitle>
              </CardHeader>
              <CardContent>
                <AmountList rows={summary.month.expenseByCategory} money={money} emptyLabel={t("semMovimentoNoMes")} />
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}

type KpiCardProps = {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  tone?: "positive" | "negative";
};

function KpiCard({ label, value, icon: Icon, tone }: KpiCardProps) {
  return (
    <Card>
      <CardContent className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <span className="text-sm text-muted-foreground">{label}</span>
          <span className="text-2xl font-semibold tabular-nums">{value}</span>
        </div>
        <div
          className={cn(
            "flex size-9 shrink-0 items-center justify-center rounded-full bg-muted",
            tone === "positive" && "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
            tone === "negative" && "bg-destructive/10 text-destructive"
          )}
        >
          <Icon className="size-4" />
        </div>
      </CardContent>
    </Card>
  );
}

type AmountRow = {
  id: string;
  name: string;
  amountCents: number;
  badge?: string;
  icon?: React.ComponentType<{ className?: string }>;
};

function AmountList({ rows, money, emptyLabel }: { rows: AmountRow[]; money: (cents: number) => string; emptyLabel: string }) {
  if (rows.length === 0) return <p className="text-sm text-muted-foreground">{emptyLabel}</p>;

  return (
    <ul className="flex flex-col divide-y">
      {rows.map((row) => (
        <li key={row.id} className="flex items-center justify-between gap-3 py-2 text-sm">
          <span className="flex min-w-0 items-center gap-2">
            {row.icon && <row.icon className="size-4 shrink-0 text-muted-foreground" />}
            <span className="truncate">{row.name}</span>
            {row.badge && <Badge variant="outline">{row.badge}</Badge>}
          </span>
          <span className={cn("font-medium tabular-nums", row.amountCents < 0 && "text-destructive")}>
            {money(row.amountCents)}
          </span>
        </li>
      ))}
    </ul>
  );
}
