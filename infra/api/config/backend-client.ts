import "server-only";

import {
  clearAuthCookies,
  getAccessToken,
  getRefreshToken,
  setAuthCookies,
} from "./cookies";

const BACKEND_URL = process.env.BACKEND_API_URL;

export class BackendHttpError extends Error {
  status: number;
  code?: string;

  constructor(status: number, code?: string, message?: string) {
    super(message ?? "Erro ao comunicar com o backend");
    this.status = status;
    this.code = code;
  }
}

type BackendEnvelope<T = unknown> = { success: boolean; data?: T; code?: string; message?: string };

async function rawBackendFetch(path: string, init: RequestInit, accessToken?: string) {
  if (!BACKEND_URL) {
    throw new Error("BACKEND_API_URL não configurado no ambiente do servidor.");
  }

  return fetch(`${BACKEND_URL}${path}`, {
    ...init,
    headers: {
      // Content-Type só quando há corpo: o backend (Fastify) tenta fazer JSON.parse do
      // corpo sempre que este header está presente, e quebra com 500 num DELETE sem body.
      ...(init.body ? { "Content-Type": "application/json" } : {}),
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...init.headers,
    },
    cache: "no-store",
  });
}

async function parseBody(response: Response): Promise<BackendEnvelope> {
  return response.json().catch(() => ({ success: false }));
}

async function tryRefresh(): Promise<string | null> {
  const refreshToken = await getRefreshToken();
  if (!refreshToken) return null;

  const response = await rawBackendFetch("/auth/refresh", {
    method: "POST",
    body: JSON.stringify({ refreshToken }),
  });

  if (!response.ok) {
    await clearAuthCookies();
    return null;
  }

  const body = await parseBody(response);
  const data = body.data as { accessToken: string; refreshToken: string } | undefined;
  if (!data) {
    await clearAuthCookies();
    return null;
  }

  await setAuthCookies(data.accessToken, data.refreshToken);
  return data.accessToken;
}

/**
 * Ponto único usado por todas as rotas BFF autenticadas (members/families/ministries).
 * Monta Authorization a partir do cookie, chama o backend real e, em caso de 401,
 * tenta renovar a sessão via refresh token uma única vez antes de propagar o erro.
 */
export async function authenticatedBackendFetch<T = unknown>(
  path: string,
  init: RequestInit = {}
): Promise<BackendEnvelope<T>> {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    throw new BackendHttpError(401, "UNAUTHORIZED", "Sessão ausente");
  }

  let response = await rawBackendFetch(path, init, accessToken);

  if (response.status === 401) {
    const newToken = await tryRefresh();
    if (!newToken) {
      throw new BackendHttpError(401, "UNAUTHORIZED", "Sessão expirada");
    }
    response = await rawBackendFetch(path, init, newToken);
  }

  const body = await parseBody(response);
  if (!response.ok) {
    throw new BackendHttpError(response.status, body.code, body.message);
  }

  return body as BackendEnvelope<T>;
}

/** Chamada ao backend real sem autenticação (login, registro). */
export async function publicBackendFetch<T = unknown>(
  path: string,
  init: RequestInit = {}
): Promise<BackendEnvelope<T>> {
  const response = await rawBackendFetch(path, init);
  const body = await parseBody(response);

  if (!response.ok) {
    throw new BackendHttpError(response.status, body.code, body.message);
  }

  return body as BackendEnvelope<T>;
}
