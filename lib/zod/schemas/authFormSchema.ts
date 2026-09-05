import { z } from "zod";

type ValidationT = (key: string) => string;

export const loginFormSchema = (t: ValidationT) =>
  z.object({
    email: z.string().trim().min(1, t("campoObrigatorio")).email(t("emailInvalido")),
    password: z.string().min(1, t("campoObrigatorio")),
  });

export type LoginFormData = z.infer<ReturnType<typeof loginFormSchema>>;

export const registerFormSchema = (t: ValidationT) =>
  z.object({
    email: z.string().trim().min(1, t("campoObrigatorio")).email(t("emailInvalido")),
    password: z.string().min(6, t("senhaMinima")),
  });

export type RegisterFormData = z.infer<ReturnType<typeof registerFormSchema>>;
