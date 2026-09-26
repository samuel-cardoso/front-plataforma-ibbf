import { createTranslator } from "use-intl/core";
import ptBR from "../../../messages/pt-BR.json";
import en from "../../../messages/en.json";
import { LOCALE_COOKIE, DEFAULT_LOCALE, isSupportedLocale, type Locale } from "@/config/i18n";

const messagesByLocale: Record<Locale, typeof ptBR> = { "pt-BR": ptBR, en };

function getActiveLocale(): Locale {
  if (typeof document === "undefined") return DEFAULT_LOCALE;

  const match = document.cookie.match(new RegExp(`(?:^|; )${LOCALE_COOKIE}=([^;]*)`));
  const value = match ? decodeURIComponent(match[1]) : undefined;
  return isSupportedLocale(value) ? value : DEFAULT_LOCALE;
}

function getTranslator() {
  const locale = getActiveLocale();
  return createTranslator({ locale, messages: messagesByLocale[locale], namespace: "erros" });
}

/** Traduz um `code` de erro estável do backend (ex.: "MEMBER.CPF_ALREADY_EXISTS") para uma mensagem amigável. */
export function translateErrorCode(code: string | undefined): string {
  const translator = getTranslator();
  if (!code) return translator("padrao");

  // @ts-expect-error -- os `code`s do backend não são conhecidos estaticamente pelo schema de mensagens.
  const hasKey = translator.has(code);
  if (!hasKey) return translator("padrao");

  // @ts-expect-error -- idem acima.
  return translator(code);
}

type ApiErrorBody = { code?: string; message?: string };
type AxiosLikeError = { response?: { data?: ApiErrorBody } };

/** Extrai uma mensagem amigável de um erro vindo do `bffApi` (Axios). */
export function getAxiosErrorMessage(error: unknown): string {
  const axiosError = error as AxiosLikeError;
  const code = axiosError?.response?.data?.code;
  return translateErrorCode(code);
}
