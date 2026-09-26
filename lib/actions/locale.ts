"use server";

import { cookies } from "next/headers";
import { LOCALE_COOKIE, isSupportedLocale, type Locale } from "@/config/i18n";

export async function setLocale(locale: Locale) {
  if (!isSupportedLocale(locale)) return;

  const store = await cookies();
  store.set(LOCALE_COOKIE, locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
}
