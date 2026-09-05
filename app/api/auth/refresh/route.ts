import { NextResponse } from "next/server";
import { publicBackendFetch } from "@/infra/api/config/backend-client";
import { getRefreshToken, setAuthCookies, clearAuthCookies } from "@/infra/api/config/cookies";
import { handleProxyError } from "../../_helpers/proxy-error";

type RefreshResponseData = { accessToken: string; refreshToken: string };

/**
 * Renovação explícita, chamável pelo client. O fluxo principal de refresh acontece
 * de forma transparente dentro de `authenticatedBackendFetch` para as rotas de domínio.
 */
export async function POST() {
  try {
    const refreshToken = await getRefreshToken();
    if (!refreshToken) {
      return NextResponse.json(
        { success: false, code: "UNAUTHORIZED", message: "Sessão ausente" },
        { status: 401 }
      );
    }

    const result = await publicBackendFetch<RefreshResponseData>("/auth/refresh", {
      method: "POST",
      body: JSON.stringify({ refreshToken }),
    });

    const data = result.data as RefreshResponseData;
    await setAuthCookies(data.accessToken, data.refreshToken);

    return NextResponse.json({ success: true });
  } catch (error) {
    await clearAuthCookies();
    return handleProxyError(error);
  }
}
