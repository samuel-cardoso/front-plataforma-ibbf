import type { Metadata } from "next";
import { Suspense } from "react";
import { getTranslations } from "@/hooks/i18n";
import { VerifyEmailForm } from "@/components/auth";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("auth");
  return { title: t("confirmarEmail") };
}

export default function ConfirmEmailPage() {
  return (
    <Suspense>
      <VerifyEmailForm />
    </Suspense>
  );
}
