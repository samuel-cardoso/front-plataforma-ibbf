import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { memberFormSchema, type MemberFormData } from "@/lib/zod/schemas/memberFormSchema";
import type { Member } from "@/lib/types/memberApiTypes";

export function useMemberForm(t: (key: string) => string, member?: Member) {
  return useForm<MemberFormData>({
    resolver: zodResolver(memberFormSchema(t)),
    defaultValues: {
      fullName: member?.fullName ?? "",
      cpf: member?.cpf ?? "",
      birthDate: member?.birthDate ?? "",
      phone: member?.phone ?? "",
      address: member?.address ?? "",
      memberType: member?.memberType ?? "MEMBER",
      memberStatus: member?.memberStatus ?? "ACTIVE",
      joinedAt: member?.joinedAt ?? "",
      baptized: member?.baptized ?? false,
      familyId: member?.familyId ?? "none",
    },
  });
}
