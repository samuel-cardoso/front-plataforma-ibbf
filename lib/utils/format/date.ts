import { ptBR, enUS, type Locale as DateFnsLocale } from "date-fns/locale";
import type { Locale } from "@/config/i18n";

const DATE_FNS_LOCALES: Record<Locale, DateFnsLocale> = {
  "pt-BR": ptBR,
  en: enUS,
};

export function getDateFnsLocale(locale: string): DateFnsLocale {
  return DATE_FNS_LOCALES[locale as Locale] ?? ptBR;
}

export function formatLocalizedDate(date: string | Date, locale: string): string {
  const parsedDate = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale, { dateStyle: "short" }).format(parsedDate);
}
