import { NextResponse } from "next/server";
import { getAccessToken } from "@/infra/api/config/cookies";
import { decodeJwtPayload } from "@/lib/utils/api/decodeJwtPayload";
import type { SessionUser } from "@/lib/types/authTypes";

type JwtPayload = { sub: string; email: string; roleId: string };

export async function GET() {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    return NextResponse.json({ success: false, code: "UNAUTHORIZED" }, { status: 401 });
  }

  const payload = decodeJwtPayload<JwtPayload>(accessToken);
  if (!payload) {
    return NextResponse.json({ success: false, code: "UNAUTHORIZED" }, { status: 401 });
  }

  const user: SessionUser = { id: payload.sub, email: payload.email, roleId: payload.roleId };
  return NextResponse.json({ success: true, data: { user } });
}
