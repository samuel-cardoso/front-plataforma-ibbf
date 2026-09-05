import { z } from "zod";
import { MEMBER_STATUS_VALUES, MEMBER_TYPE_VALUES } from "@/lib/consts/member";

type ValidationT = (key: string) => string;

const isValidCpf = (value: string) => /^\d{11}$/.test(value.replace(/\D/g, ""));

export const memberFormSchema = (t: ValidationT) =>
  z.object({
    fullName: z.string().trim().min(1, t("campoObrigatorio")),
    cpf: z
      .string()
      .trim()
      .optional()
      .refine((value) => !value || isValidCpf(value), t("cpfInvalido")),
    birthDate: z.string().min(1, t("campoObrigatorio")),
    phone: z.string().trim().optional(),
    address: z.string().trim().optional(),
    memberType: z
      .string()
      .min(1, t("campoObrigatorio"))
      .refine((value) => (MEMBER_TYPE_VALUES as string[]).includes(value), t("valorInvalido")),
    memberStatus: z
      .string()
      .min(1, t("campoObrigatorio"))
      .refine((value) => (MEMBER_STATUS_VALUES as string[]).includes(value), t("valorInvalido")),
    joinedAt: z.string().optional(),
    baptized: z.boolean(),
    familyId: z.string().optional(),
  });

export type MemberFormData = z.infer<ReturnType<typeof memberFormSchema>>;
