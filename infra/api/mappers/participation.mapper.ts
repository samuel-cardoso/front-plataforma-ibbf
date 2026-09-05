import type { Participation } from "@/lib/types/ministryApiTypes";

export function mapParticipation(raw: unknown): Participation {
  const r = raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};
  return {
    id: String(r.id ?? ""),
    memberId: String(r.memberId ?? ""),
    ministryId: String(r.ministryId ?? ""),
    memberName: r.memberName ? String(r.memberName) : undefined,
    role: (r.role as Participation["role"]) ?? "MEMBER",
    joinedAt: String(r.joinedAt ?? ""),
  };
}
