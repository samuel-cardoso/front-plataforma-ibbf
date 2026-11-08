import "server-only";

import { BackendHttpError } from "./backend-client";

/**
 * APIs de conteúdo público (Bíblia, Cantor Cristão e cânticos): serviços próprios, separados
 * do backend principal, sem autenticação. Assim como o backend, só são chamadas server-side
 * pelas rotas BFF — o browser nunca conhece essas URLs.
 */
const CONTENT_API_URLS = {
  bible: process.env.BIBLE_API_URL,
  hymnal: process.env.HYMNAL_API_URL,
  canticles: process.env.CANTICLES_API_URL,
} as const;

const CONTENT_API_ENV_NAMES = {
  bible: "BIBLE_API_URL",
  hymnal: "HYMNAL_API_URL",
  canticles: "CANTICLES_API_URL",
} as const;

export type ContentApi = keyof typeof CONTENT_API_URLS;

type ContentEnvelope<T = unknown> = { success: boolean; data?: T; code?: string; message?: string };

export async function contentApiFetch<T = unknown>(api: ContentApi, path: string): Promise<ContentEnvelope<T>> {
  const baseUrl = CONTENT_API_URLS[api];
  if (!baseUrl) {
    throw new Error(`${CONTENT_API_ENV_NAMES[api]} não configurado no ambiente do servidor.`);
  }

  let response: Response;
  try {
    // O conteúdo é estático nos serviços: cache curto no servidor evita repetir a mesma leitura.
    response = await fetch(`${baseUrl}${path}`, { next: { revalidate: 300 } });
  } catch {
    throw new BackendHttpError(503, "CONTENT.UNAVAILABLE", "Serviço de conteúdo indisponível");
  }

  const body = (await response.json().catch(() => ({ success: false }))) as ContentEnvelope<T>;
  if (!response.ok) {
    throw new BackendHttpError(response.status, body.code, body.message);
  }
  return body;
}
