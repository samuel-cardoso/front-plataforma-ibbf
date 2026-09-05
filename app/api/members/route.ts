import { NextResponse, type NextRequest } from "next/server";
import { authenticatedBackendFetch } from "@/infra/api/config/backend-client";
import { handleProxyError } from "../_helpers/proxy-error";

export async function GET(request: NextRequest) {
  try {
    const qs = request.nextUrl.searchParams.toString();
    const result = await authenticatedBackendFetch(`/members${qs ? `?${qs}` : ""}`);
    return NextResponse.json(result);
  } catch (error) {
    return handleProxyError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = await authenticatedBackendFetch("/members", {
      method: "POST",
      body: JSON.stringify(body),
    });
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return handleProxyError(error);
  }
}
