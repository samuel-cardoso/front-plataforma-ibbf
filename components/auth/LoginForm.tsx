"use client";

import { useRouter, useTranslations, useLoginForm, useLogin } from "@/hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { paths } from "@/lib/utils/paths";
import { getAxiosErrorMessage } from "@/lib/utils/api/getAxiosErrorMessage";
import { toast } from "sonner";
import Link from "next/link";
import type { LoginFormData } from "@/lib/zod/schemas/authFormSchema";

export function LoginForm() {
  const t = useTranslations("auth");
  const tValidation = useTranslations("validacao");
  const router = useRouter();
  const { login, isLoggingIn } = useLogin();

  const form = useLoginForm(tValidation);
  const { register, handleSubmit, formState } = form;

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data);
      router.push(paths.home);
    } catch (error) {
      toast.error(getAxiosErrorMessage(error));
    }
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>{t("loginTitulo")}</CardTitle>
        <CardDescription>{t("loginDescricao")}</CardDescription>
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
              autoComplete="current-password"
              {...register("password")}
            />
            {formState.errors.password && (
              <p className="text-sm text-destructive">{formState.errors.password.message}</p>
            )}
          </div>
          <Button type="submit" disabled={isLoggingIn} className="mt-2">
            {isLoggingIn ? t("entrando") : t("entrar")}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            {t("naoTemConta")}{" "}
            <Link href={paths.register} className="font-medium text-primary hover:underline">
              {t("criarConta")}
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
