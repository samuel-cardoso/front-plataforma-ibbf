import { NextResponse, type NextRequest } from "next/server";
import { contentApiFetch } from "@/infra/api/config/content-client";
import { handleProxyError } from "../../_helpers/proxy-error";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;
    const result = await contentApiFetch("canticles", `/canticles/${encodeURIComponent(id)}`);
    return NextResponse.json(result);
  } catch (error) {
    return handleProxyError(error);
  }
}
