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

export const forgotPasswordFormSchema = (t: ValidationT) =>
  z.object({
    email: z.string().trim().min(1, t("campoObrigatorio")).email(t("emailInvalido")),
  });

export type ForgotPasswordFormData = z.infer<ReturnType<typeof forgotPasswordFormSchema>>;

export const resetPasswordFormSchema = (t: ValidationT) =>
  z
    .object({
      email: z.string().trim().min(1, t("campoObrigatorio")).email(t("emailInvalido")),
      code: z
        .string()
        .trim()
        .min(1, t("campoObrigatorio"))
        .regex(/^\d{6}$/, t("codigoInvalido")),
      newPassword: z.string().min(6, t("senhaMinima")),
      confirmPassword: z.string().min(1, t("campoObrigatorio")),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: t("senhasNaoConferem"),
      path: ["confirmPassword"],
    });

export type ResetPasswordFormData = z.infer<ReturnType<typeof resetPasswordFormSchema>>;
