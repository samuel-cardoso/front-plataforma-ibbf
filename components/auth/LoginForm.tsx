"use client";

import { useState } from "react";
import { useRouter, useTranslations, useLoginForm, useLogin } from "@/hooks";
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
import type { LoginFormData } from "@/lib/zod/schemas/authFormSchema";

export function LoginForm() {
  const t = useTranslations("auth");
  const tValidation = useTranslations("validacao");
  const router = useRouter();
  const { login, isLoggingIn } = useLogin();
  const [showPassword, setShowPassword] = useState(false);

  const form = useLoginForm(tValidation);
  const { register, handleSubmit, formState } = form;

  const onSubmit = async (data: LoginFormData) => {
    try {
      const user = await login(data);
      if (user.emailVerifiedAt === null) {
        router.push(`${paths.confirmEmail}?email=${encodeURIComponent(user.email)}`);
      } else {
        router.push(paths.home);
      }
    } catch (error) {
      toast.error(getAxiosErrorMessage(error));
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">{t("loginTitulo")}</CardTitle>
          <CardDescription>{t("loginDescricao")}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
              <Field data-invalid={!!formState.errors.email}>
                <FieldLabel htmlFor="email">{t("email")}</FieldLabel>
                <Input id="email" type="email" autoComplete="email" {...register("email")} />
                <FieldError errors={[formState.errors.email]} />
              </Field>
              <Field data-invalid={!!formState.errors.password}>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">{t("senha")}</FieldLabel>
                  <Link
                    href={paths.forgotPassword}
                    className="ml-auto text-sm underline-offset-4 hover:underline"
                  >
                    {t("esqueceuSenha")}
                  </Link>
                </div>
                <InputGroup>
                  <InputGroupInput
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    {...register("password")}
                  />
                  <InputGroupAddon align="inline-end">
                    <InputGroupButton
                      type="button"
                      size="icon-xs"
                      aria-label={showPassword ? t("ocultarSenha") : t("mostrarSenha")}
                      onClick={() => setShowPassword((value) => !value)}
                    >
                      {showPassword ? <EyeOff /> : <Eye />}
                    </InputGroupButton>
                  </InputGroupAddon>
                </InputGroup>
                <FieldError errors={[formState.errors.password]} />
              </Field>
              <Field>
                <Button type="submit" loading={isLoggingIn}>
                  {isLoggingIn ? t("entrando") : t("entrar")}
                </Button>
                <FieldDescription className="text-center">
                  {t("naoTemConta")}{" "}
                  <Link href={paths.register}>{t("criarConta")}</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        {t("aoContinuarPrefixo")} <Link href={paths.terms}>{t("termosDeUso")}</Link> {t("e")}{" "}
        <Link href={paths.privacy}>{t("politicaDePrivacidade")}</Link>.
      </FieldDescription>
    </div>
  );
}
