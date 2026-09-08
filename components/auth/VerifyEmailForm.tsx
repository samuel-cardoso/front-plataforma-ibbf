"use client";

import { useEffect, useState } from "react";
import {
  useSearchParams,
  useTranslations,
  useVerifyEmailForm,
  useVerifyEmail,
  useResendVerification,
  Controller,
} from "@/hooks";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel, FieldError, FieldDescription } from "@/components/ui/field";
import { paths } from "@/lib/utils/paths";
import { getAxiosErrorMessage } from "@/lib/utils/api/getAxiosErrorMessage";
import { toast } from "sonner";
import Link from "next/link";
import type { VerifyEmailFormData } from "@/lib/zod/schemas/authFormSchema";

export function VerifyEmailForm() {
  const t = useTranslations("auth");
  const tValidation = useTranslations("validacao");
  const searchParams = useSearchParams();
  const emailFromQuery = searchParams.get("email") ?? "";
  const codeFromQuery = searchParams.get("code") ?? "";
  const { verifyEmail, isVerifyingEmail } = useVerifyEmail();
  const { resendVerification, isResendingVerification } = useResendVerification();
  const [verified, setVerified] = useState(false);

  const form = useVerifyEmailForm(tValidation, emailFromQuery, codeFromQuery);
  const { register, control, handleSubmit, formState, getValues } = form;

  const onSubmit = async (data: VerifyEmailFormData) => {
    try {
      await verifyEmail(data);
      setVerified(true);
    } catch (error) {
      toast.error(getAxiosErrorMessage(error));
    }
  };

  useEffect(() => {
    if (emailFromQuery && codeFromQuery) {
      handleSubmit(onSubmit)();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleResend = async () => {
    const email = getValues("email");
    try {
      await resendVerification({ email });
      toast.success(t("codigoReenviado"));
    } catch (error) {
      toast.error(getAxiosErrorMessage(error));
    }
  };

  if (verified) {
    return (
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">{t("emailConfirmadoTitulo")}</CardTitle>
          <CardDescription>{t("emailConfirmadoDescricao")}</CardDescription>
        </CardHeader>
        <CardContent>
          <Link href={paths.home} className={buttonVariants({ className: "w-full" })}>
            {t("continuar")}
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-xl">{t("confirmarEmailTitulo")}</CardTitle>
        <CardDescription>{t("confirmarEmailDescricao")}</CardDescription>
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
              <FieldLabel>{t("codigo")}</FieldLabel>
              <Controller
                control={control}
                name="code"
                render={({ field }) => (
                  <InputOTP
                    maxLength={6}
                    value={field.value}
                    onChange={field.onChange}
                    onComplete={() => handleSubmit(onSubmit)()}
                    autoFocus={!codeFromQuery}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                )}
              />
              <FieldError errors={[formState.errors.code]} />
            </Field>
            <Field>
              <Button type="submit" loading={isVerifyingEmail}>
                {isVerifyingEmail ? t("confirmando") : t("confirmarEmail")}
              </Button>
              <FieldDescription className="text-center">
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={isResendingVerification}
                  className="underline underline-offset-4 disabled:opacity-50"
                >
                  {isResendingVerification ? t("enviando") : t("reenviarCodigo")}
                </button>
              </FieldDescription>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
