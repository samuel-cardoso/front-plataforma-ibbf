"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useLocale, useTranslations } from "@/hooks";
import { Button } from "@/components/ui/button";

type MonthSwitcherProps = {
  year: number;
  month: number;
  onChange: (value: { year: number; month: number }) => void;
};

export function MonthSwitcher({ year, month, onChange }: MonthSwitcherProps) {
  const locale = useLocale();
  const t = useTranslations("financeiro");
  const formatted = new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" }).format(new Date(year, month - 1, 1));
  // Só a primeira letra: `capitalize` do CSS viraria "Novembro De 2026".
  const label = formatted.charAt(0).toUpperCase() + formatted.slice(1);

  const shift = (delta: number) => {
    const date = new Date(year, month - 1 + delta, 1);
    onChange({ year: date.getFullYear(), month: date.getMonth() + 1 });
  };

  return (
    <div className="flex items-center gap-1">
      <Button variant="outline" size="icon-sm" onClick={() => shift(-1)} aria-label={t("mesAnterior")}>
        <ChevronLeftIcon />
      </Button>
      <span className="min-w-36 text-center text-sm font-medium">{label}</span>
      <Button variant="outline" size="icon-sm" onClick={() => shift(1)} aria-label={t("proximoMes")}>
        <ChevronRightIcon />
      </Button>
    </div>
  );
}

export function currentYearMonth() {
  const now = new Date();
  return { year: now.getFullYear(), month: now.getMonth() + 1 };
}

/** Primeiro e último dia do mês em yyyy-MM-dd, para filtrar o livro-caixa. */
export function monthBounds(year: number, month: number) {
  const pad = (value: number) => String(value).padStart(2, "0");
  const lastDay = new Date(year, month, 0).getDate();
  return { from: `${year}-${pad(month)}-01`, to: `${year}-${pad(month)}-${pad(lastDay)}` };
}
