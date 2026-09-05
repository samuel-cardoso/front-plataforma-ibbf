import type { Member } from "@/lib/types/memberApiTypes";

export function mapMember(raw: unknown): Member {
  const r = raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};
  return {
    id: String(r.id ?? ""),
    userId: (r.userId as string | null) ?? null,
    familyId: (r.familyId as string | null) ?? null,
    fullName: String(r.fullName ?? ""),
    cpf: (r.cpf as string | null) ?? null,
    birthDate: String(r.birthDate ?? ""),
    phone: (r.phone as string | null) ?? null,
    address: (r.address as string | null) ?? null,
    memberType: (r.memberType as Member["memberType"]) ?? "MEMBER",
    memberStatus: (r.memberStatus as Member["memberStatus"]) ?? "ACTIVE",
    joinedAt: String(r.joinedAt ?? ""),
    baptized: Boolean(r.baptized),
  };
}
