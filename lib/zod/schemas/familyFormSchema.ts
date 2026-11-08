import { z } from "zod";

type ValidationT = (key: string) => string;

export const familyFormSchema = (t: ValidationT) =>
  z.object({
    name: z.string().trim().min(1, t("campoObrigatorio")),
    address: z.string().trim().optional(),
  });

export type FamilyFormData = z.infer<ReturnType<typeof familyFormSchema>>;
