"use client";

import { useState } from "react";
import {
  useRouter,
  useSearchParams,
  useTranslations,
  useResetPasswordForm,
  useResetPassword,
} from "@/hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel, FieldError, FieldDescription } from "@/components/ui/field";
import { paths } from "@/lib/utils/paths";
import { getAxiosErrorMessage } from "@/lib/utils/api/getAxiosErrorMessage";
import { toast } from "sonner";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import type { ResetPasswordFormData } from "@/lib/zod/schemas/authFormSchema";

export function ResetPasswordForm() {
  const t = useTranslations("auth");
  const tValidation = useTranslations("validacao");
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailFromQuery = searchParams.get("email") ?? "";
  const codeFromQuery = searchParams.get("code") ?? "";
  const { resetPassword, isResettingPassword } = useResetPassword();
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useResetPasswordForm(tValidation, emailFromQuery, codeFromQuery);
  const { register, handleSubmit, formState } = form;

  const onSubmit = async (data: ResetPasswordFormData) => {
    try {
      await resetPassword(data);
      toast.success(t("senhaRedefinida"));
      router.push(paths.login);
    } catch (error) {
      toast.error(getAxiosErrorMessage(error));
    }
  };

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-xl">{t("redefinirSenhaTitulo")}</CardTitle>
        <CardDescription>{t("redefinirSenhaDescricao")}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            <Field data-invalid={!!formState.errors.email}>
              <FieldLabel htmlFor="email">{t("email")}</FieldLabel>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                readOnly={!!emailFromQuery}
                {...register("email")}
              />
              <FieldError errors={[formState.errors.email]} />
            </Field>
            <Field data-invalid={!!formState.errors.code}>
              <FieldLabel htmlFor="code">{t("codigo")}</FieldLabel>
              <Input
                id="code"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                readOnly={!!codeFromQuery}
                {...register("code")}
              />
              <FieldError errors={[formState.errors.code]} />
            </Field>
            <Field data-invalid={!!formState.errors.newPassword}>
              <FieldLabel htmlFor="newPassword">{t("novaSenha")}</FieldLabel>
              <InputGroup>
                <InputGroupInput
                  id="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  autoComplete="new-password"
                  autoFocus={!!emailFromQuery && !!codeFromQuery}
                  {...register("newPassword")}
                />
                <InputGroupAddon align="inline-end">
                  <InputGroupButton
                    type="button"
                    size="icon-xs"
                    aria-label={showNewPassword ? t("ocultarSenha") : t("mostrarSenha")}
                    onClick={() => setShowNewPassword((value) => !value)}
                  >
                    {showNewPassword ? <EyeOff /> : <Eye />}
                  </InputGroupButton>
                </InputGroupAddon>
              </InputGroup>
              <FieldError errors={[formState.errors.newPassword]} />
            </Field>
            <Field data-invalid={!!formState.errors.confirmPassword}>
              <FieldLabel htmlFor="confirmPassword">{t("confirmarSenha")}</FieldLabel>
              <InputGroup>
                <InputGroupInput
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  {...register("confirmPassword")}
                />
                <InputGroupAddon align="inline-end">
                  <InputGroupButton
                    type="button"
                    size="icon-xs"
                    aria-label={showConfirmPassword ? t("ocultarSenha") : t("mostrarSenha")}
                    onClick={() => setShowConfirmPassword((value) => !value)}
                  >
                    {showConfirmPassword ? <EyeOff /> : <Eye />}
                  </InputGroupButton>
                </InputGroupAddon>
              </InputGroup>
              <FieldError errors={[formState.errors.confirmPassword]} />
            </Field>
            <Field>
              <Button type="submit" loading={isResettingPassword}>
                {isResettingPassword ? t("redefinindo") : t("redefinirSenha")}
              </Button>
              <FieldDescription className="text-center">
                <Link href={paths.login}>{t("voltarParaLogin")}</Link>
              </FieldDescription>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
