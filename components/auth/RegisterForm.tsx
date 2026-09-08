"use client";

import { useState } from "react";
import { useRouter, useTranslations, useRegisterForm, useRegister } from "@/hooks";
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
import type { RegisterFormData } from "@/lib/zod/schemas/authFormSchema";

export function RegisterForm() {
  const t = useTranslations("auth");
  const tValidation = useTranslations("validacao");
  const router = useRouter();
  const { register: registerUser, isRegistering } = useRegister();
  const [showPassword, setShowPassword] = useState(false);

  const form = useRegisterForm(tValidation);
  const { register, handleSubmit, formState } = form;

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await registerUser(data);
      router.push(paths.home);
    } catch (error) {
      toast.error(getAxiosErrorMessage(error));
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">{t("registroTitulo")}</CardTitle>
          <CardDescription>{t("registroDescricao")}</CardDescription>
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
                <FieldLabel htmlFor="password">{t("senha")}</FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
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
                <Button type="submit" disabled={isRegistering}>
                  {isRegistering ? t("criandoConta") : t("criarConta")}
                </Button>
                <FieldDescription className="text-center">
                  {t("jaTemConta")} <Link href={paths.login}>{t("entrar")}</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        {t("aoContinuarPrefixo")} <a href="#">{t("termosDeUso")}</a> {t("e")}{" "}
        <a href="#">{t("politicaDePrivacidade")}</a>.
      </FieldDescription>
    </div>
  );
}
