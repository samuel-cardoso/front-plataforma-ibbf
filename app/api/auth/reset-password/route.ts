import { NextResponse, type NextRequest } from "next/server";
import { publicBackendFetch } from "@/infra/api/config/backend-client";
import { handleProxyError } from "../../_helpers/proxy-error";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    await publicBackendFetch("/auth/reset-password", {
      method: "POST",
      body: JSON.stringify(body),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleProxyError(error);
  }
}
