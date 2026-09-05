import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ministryMemberFormSchema,
  type MinistryMemberFormData,
} from "@/lib/zod/schemas/ministryMemberFormSchema";

export function useMinistryMemberForm(t: (key: string) => string) {
  return useForm<MinistryMemberFormData>({
    resolver: zodResolver(ministryMemberFormSchema(t)),
    defaultValues: {
      memberId: "",
      role: "MEMBER",
    },
  });
}
