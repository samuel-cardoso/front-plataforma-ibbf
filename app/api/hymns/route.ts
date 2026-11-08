import { NextResponse, type NextRequest } from "next/server";
import { contentApiFetch } from "@/infra/api/config/content-client";
import { handleProxyError } from "../_helpers/proxy-error";

export async function GET(request: NextRequest) {
  try {
    const qs = request.nextUrl.searchParams.toString();
    const result = await contentApiFetch("hymnal", `/hymns${qs ? `?${qs}` : ""}`);
    return NextResponse.json(result);
  } catch (error) {
    return handleProxyError(error);
  }
}
