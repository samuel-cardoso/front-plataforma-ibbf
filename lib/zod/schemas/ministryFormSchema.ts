import { z } from "zod";

type ValidationT = (key: string) => string;

export const ministryFormSchema = (t: ValidationT) =>
  z.object({
    name: z.string().trim().min(1, t("campoObrigatorio")),
    leaderId: z.string().optional(),
    description: z.string().trim().optional(),
  });

export type MinistryFormData = z.infer<ReturnType<typeof ministryFormSchema>>;
