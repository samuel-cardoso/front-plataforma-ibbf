import type { Metadata } from "next";
import { getTranslations } from "@/hooks/i18n";
import { ForgotPasswordForm } from "@/components/auth";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("auth");
  return { title: t("esqueceuSenha") };
}

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
