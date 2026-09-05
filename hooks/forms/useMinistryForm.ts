import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ministryFormSchema, type MinistryFormData } from "@/lib/zod/schemas/ministryFormSchema";
import type { Ministry } from "@/lib/types/ministryApiTypes";

export function useMinistryForm(t: (key: string) => string, ministry?: Ministry) {
  return useForm<MinistryFormData>({
    resolver: zodResolver(ministryFormSchema(t)),
    defaultValues: {
      name: ministry?.name ?? "",
      leaderId: ministry?.leaderId ?? "none",
      description: ministry?.description ?? "",
    },
  });
}
