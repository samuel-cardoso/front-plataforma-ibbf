import { getRequestConfig } from "next-intl/server";

export const DEFAULT_LOCALE = "pt-BR";

export default getRequestConfig(async () => {
  const locale = DEFAULT_LOCALE;

  return {
    locale,
    timeZone: "America/Sao_Paulo",
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
