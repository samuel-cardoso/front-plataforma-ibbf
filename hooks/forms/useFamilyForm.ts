import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { familyFormSchema, type FamilyFormData } from "@/lib/zod/schemas/familyFormSchema";
import type { Family } from "@/lib/types/familyApiTypes";

export function useFamilyForm(t: (key: string) => string, family?: Family) {
  return useForm<FamilyFormData>({
    resolver: zodResolver(familyFormSchema(t)),
    defaultValues: {
      name: family?.name ?? "",
    },
  });
}
