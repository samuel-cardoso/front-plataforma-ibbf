import { NextResponse, type NextRequest } from "next/server";
import { authenticatedBackendFetch } from "@/infra/api/config/backend-client";
import { handleProxyError } from "../../_helpers/proxy-error";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;
    const result = await authenticatedBackendFetch(`/members/${id}`);
    return NextResponse.json(result);
  } catch (error) {
    return handleProxyError(error);
  }
}

export async function PATCH(request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;
    const body = await request.json();
    const result = await authenticatedBackendFetch(`/members/${id}`, {
      method: "PATCH",
      body: JSON.stringify(body),
    });
    return NextResponse.json(result);
  } catch (error) {
    return handleProxyError(error);
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;
    const result = await authenticatedBackendFetch(`/members/${id}`, { method: "DELETE" });
    return NextResponse.json(result);
  } catch (error) {
    return handleProxyError(error);
  }
}
