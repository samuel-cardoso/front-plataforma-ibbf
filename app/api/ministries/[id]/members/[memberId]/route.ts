import { NextResponse, type NextRequest } from "next/server";
import { authenticatedBackendFetch } from "@/infra/api/config/backend-client";
import { handleProxyError } from "../../../../_helpers/proxy-error";

type RouteContext = { params: Promise<{ id: string; memberId: string }> };

export async function PATCH(request: NextRequest, { params }: RouteContext) {
  try {
    const { id, memberId } = await params;
    const body = await request.json();
    const result = await authenticatedBackendFetch(`/ministries/${id}/members/${memberId}`, {
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
    const { id, memberId } = await params;
    const result = await authenticatedBackendFetch(`/ministries/${id}/members/${memberId}`, {
      method: "DELETE",
    });
    return NextResponse.json(result);
  } catch (error) {
    return handleProxyError(error);
  }
}
