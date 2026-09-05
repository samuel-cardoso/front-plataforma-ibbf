import "server-only";

import { cookies } from "next/headers";
import { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE } from "@/config/auth";

const isCookieSecure = process.env.COOKIE_SECURE === "true";

const commonCookieOptions = {
  httpOnly: true,
  secure: isCookieSecure,
  sameSite: "lax" as const,
  path: "/",
};

// Cookies só podem ser escritos dentro de Route Handlers/Server Actions (app/api/*);
// só podem ser lidos em qualquer contexto de servidor (Server Components, Route Handlers).
export async function setAuthCookies(accessToken: string, refreshToken: string) {
  const store = await cookies();
  store.set(ACCESS_TOKEN_COOKIE, accessToken, commonCookieOptions);
  store.set(REFRESH_TOKEN_COOKIE, refreshToken, commonCookieOptions);
}

export async function clearAuthCookies() {
  const store = await cookies();
  store.delete(ACCESS_TOKEN_COOKIE);
  store.delete(REFRESH_TOKEN_COOKIE);
}

export async function getAccessToken() {
  const store = await cookies();
  return store.get(ACCESS_TOKEN_COOKIE)?.value;
}

export async function getRefreshToken() {
  const store = await cookies();
  return store.get(REFRESH_TOKEN_COOKIE)?.value;
}
