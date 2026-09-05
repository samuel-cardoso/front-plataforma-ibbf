import { z } from "zod";
import { MINISTRY_ROLE_VALUES } from "@/lib/consts/ministry";

type ValidationT = (key: string) => string;

export const ministryMemberFormSchema = (t: ValidationT) =>
  z.object({
    memberId: z.string().min(1, t("campoObrigatorio")),
    role: z
      .string()
      .min(1, t("campoObrigatorio"))
      .refine((value) => (MINISTRY_ROLE_VALUES as string[]).includes(value), t("valorInvalido")),
  });

export type MinistryMemberFormData = z.infer<ReturnType<typeof ministryMemberFormSchema>>;
