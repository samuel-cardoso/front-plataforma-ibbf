import type { Ministry } from "@/lib/types/ministryApiTypes";

export function mapMinistry(raw: unknown): Ministry {
  const r = raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};
  return {
    id: String(r.id ?? ""),
    name: String(r.name ?? ""),
    leaderId: (r.leaderId as string | null) ?? null,
    description: (r.description as string | null) ?? null,
  };
}
