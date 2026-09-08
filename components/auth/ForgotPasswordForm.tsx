"use client";

import { useRouter, useTranslations, useForgotPasswordForm, useForgotPassword } from "@/hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel, FieldError, FieldDescription } from "@/components/ui/field";
import { paths } from "@/lib/utils/paths";
import { getAxiosErrorMessage } from "@/lib/utils/api/getAxiosErrorMessage";
import { toast } from "sonner";
import Link from "next/link";
import type { ForgotPasswordFormData } from "@/lib/zod/schemas/authFormSchema";

export function ForgotPasswordForm() {
  const t = useTranslations("auth");
  const tValidation = useTranslations("validacao");
  const router = useRouter();
  const { forgotPassword, isSendingForgotPassword } = useForgotPassword();

  const form = useForgotPasswordForm(tValidation);
  const { register, handleSubmit, formState } = form;

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      await forgotPassword(data);
      toast.success(t("codigoEnviado"));
      router.push(`${paths.resetPassword}?email=${encodeURIComponent(data.email)}`);
    } catch (error) {
      toast.error(getAxiosErrorMessage(error));
    }
  };

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-xl">{t("esqueciSenhaTitulo")}</CardTitle>
        <CardDescription>{t("esqueciSenhaDescricao")}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            <Field data-invalid={!!formState.errors.email}>
              <FieldLabel htmlFor="email">{t("email")}</FieldLabel>
              <Input id="email" type="email" autoComplete="email" {...register("email")} />
              <FieldError errors={[formState.errors.email]} />
            </Field>
            <Field>
              <Button type="submit" loading={isSendingForgotPassword}>
                {isSendingForgotPassword ? t("enviando") : t("enviarCodigo")}
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
