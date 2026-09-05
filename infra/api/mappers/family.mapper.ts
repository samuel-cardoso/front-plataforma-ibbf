import type { Family } from "@/lib/types/familyApiTypes";

export function mapFamily(raw: unknown): Family {
  const r = raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};
  return {
    id: String(r.id ?? ""),
    name: String(r.name ?? ""),
    createdAt: String(r.createdAt ?? ""),
  };
}
