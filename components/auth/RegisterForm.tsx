"use client";

import { useRouter, useTranslations, useRegisterForm, useRegister } from "@/hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { paths } from "@/lib/utils/paths";
import { getAxiosErrorMessage } from "@/lib/utils/api/getAxiosErrorMessage";
import { toast } from "sonner";
import Link from "next/link";
import type { RegisterFormData } from "@/lib/zod/schemas/authFormSchema";

export function RegisterForm() {
  const t = useTranslations("auth");
  const tValidation = useTranslations("validacao");
  const router = useRouter();
  const { register: registerUser, isRegistering } = useRegister();

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
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>{t("registroTitulo")}</CardTitle>
        <CardDescription>{t("registroDescricao")}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5" data-field-name="email">
            <Label htmlFor="email">{t("email")}</Label>
            <Input id="email" type="email" autoComplete="email" {...register("email")} />
            {formState.errors.email && (
              <p className="text-sm text-destructive">{formState.errors.email.message}</p>
            )}
          </div>
          <div className="flex flex-col gap-1.5" data-field-name="password">
            <Label htmlFor="password">{t("senha")}</Label>
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              {...register("password")}
            />
            {formState.errors.password && (
              <p className="text-sm text-destructive">{formState.errors.password.message}</p>
            )}
          </div>
          <Button type="submit" disabled={isRegistering} className="mt-2">
            {isRegistering ? t("criandoConta") : t("criarConta")}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            {t("jaTemConta")}{" "}
            <Link href={paths.login} className="font-medium text-primary hover:underline">
              {t("entrar")}
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
