import { NextResponse, type NextRequest } from "next/server";
import { publicBackendFetch } from "@/infra/api/config/backend-client";
import { setAuthCookies } from "@/infra/api/config/cookies";
import { handleProxyError } from "../../_helpers/proxy-error";
import type { AuthUser } from "@/lib/types/authTypes";

type RegisterResponseData = { user: AuthUser; accessToken: string; refreshToken: string };

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = await publicBackendFetch<RegisterResponseData>("/auth/register", {
      method: "POST",
      body: JSON.stringify(body),
    });

    const data = result.data as RegisterResponseData;
    await setAuthCookies(data.accessToken, data.refreshToken);

    return NextResponse.json({ success: true, data: { user: data.user } }, { status: 201 });
  } catch (error) {
    return handleProxyError(error);
  }
}
