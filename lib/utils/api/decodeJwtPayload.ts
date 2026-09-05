/** Decodifica o payload de um JWT SEM verificar a assinatura — só para hidratar a UI. */
export function decodeJwtPayload<T = unknown>(token: string): T | null {
  try {
    const [, payload] = token.split(".");
    if (!payload) return null;
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const json = Buffer.from(normalized, "base64").toString("utf-8");
    return JSON.parse(json) as T;
  } catch {
    return null;
  }
}
