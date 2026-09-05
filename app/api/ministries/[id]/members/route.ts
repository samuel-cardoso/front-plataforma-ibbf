import { NextResponse, type NextRequest } from "next/server";
import { authenticatedBackendFetch } from "@/infra/api/config/backend-client";
import { handleProxyError } from "../../../_helpers/proxy-error";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;
    const qs = request.nextUrl.searchParams.toString();
    const result = await authenticatedBackendFetch(
      `/ministries/${id}/members${qs ? `?${qs}` : ""}`
    );
    return NextResponse.json(result);
  } catch (error) {
    return handleProxyError(error);
  }
}

export async function POST(request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;
    const body = await request.json();
    const result = await authenticatedBackendFetch(`/ministries/${id}/members`, {
      method: "POST",
      body: JSON.stringify(body),
    });
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return handleProxyError(error);
  }
}
