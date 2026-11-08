import { NextResponse, type NextRequest } from "next/server";
import { authenticatedBackendFetch } from "@/infra/api/config/backend-client";
import { handleProxyError } from "../../_helpers/proxy-error";

type RouteContext = { params: Promise<{ path: string[] }> };

/**
 * Proxy único para `/finance/*` do backend: o módulo tem muitas rotas e nenhuma precisa de
 * tratamento próprio no BFF — autorização e validação ficam todas no backend.
 */
async function proxy(request: NextRequest, { params }: RouteContext) {
  try {
    const { path } = await params;
    const qs = request.nextUrl.searchParams.toString();
    const target = `/finance/${path.map(encodeURIComponent).join("/")}${qs ? `?${qs}` : ""}`;
    const hasBody = request.method !== "GET" && request.method !== "DELETE";
    const body = hasBody ? await request.text() : undefined;

    const result = await authenticatedBackendFetch(target, {
      method: request.method,
      ...(body ? { body } : {}),
    });
    return NextResponse.json(result, { status: request.method === "POST" ? 201 : 200 });
  } catch (error) {
    return handleProxyError(error);
  }
}

export { proxy as GET, proxy as POST, proxy as PUT, proxy as PATCH, proxy as DELETE };
