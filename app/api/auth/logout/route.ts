import { NextResponse } from "next/server";
import { publicBackendFetch } from "@/infra/api/config/backend-client";
import { getRefreshToken, clearAuthCookies } from "@/infra/api/config/cookies";

export async function POST() {
  const refreshToken = await getRefreshToken();

  if (refreshToken) {
    try {
      await publicBackendFetch("/auth/logout", {
        method: "POST",
        body: JSON.stringify({ refreshToken }),
      });
    } catch {
      // Logout é idempotente no backend — mesmo se a chamada falhar, sempre limpamos os cookies locais.
    }
  }

  await clearAuthCookies();
  return NextResponse.json({ success: true });
}
