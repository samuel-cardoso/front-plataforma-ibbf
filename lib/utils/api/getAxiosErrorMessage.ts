import { createTranslator } from "use-intl/core";
import messages from "../../../messages/pt-BR.json";
import { DEFAULT_LOCALE } from "@/lib/i18n";

const translator = createTranslator({
  locale: DEFAULT_LOCALE,
  messages,
  namespace: "erros",
});

/** Traduz um `code` de erro estável do backend (ex.: "MEMBER.CPF_ALREADY_EXISTS") para uma mensagem amigável. */
export function translateErrorCode(code: string | undefined): string {
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
