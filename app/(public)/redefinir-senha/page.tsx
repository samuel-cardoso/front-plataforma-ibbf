import type { Metadata } from "next";
import { Suspense } from "react";
import { getTranslations } from "@/hooks/i18n";
import { ResetPasswordForm } from "@/components/auth";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("auth");
  return { title: t("redefinirSenha") };
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordForm />
    </Suspense>
  );
}
