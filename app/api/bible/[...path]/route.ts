import { NextResponse, type NextRequest } from "next/server";
import { contentApiFetch } from "@/infra/api/config/content-client";
import { handleProxyError } from "../../_helpers/proxy-error";

type RouteContext = { params: Promise<{ path: string[] }> };

/** Proxy de leitura para a API da Bíblia: `/api/bible/versions/ARC/books/Gn/chapters/1` → `/versions/ARC/...`. */
export async function GET(_request: NextRequest, { params }: RouteContext) {
  try {
    const { path } = await params;
    const result = await contentApiFetch("bible", `/${path.map(encodeURIComponent).join("/")}`);
    return NextResponse.json(result);
  } catch (error) {
    return handleProxyError(error);
  }
}
