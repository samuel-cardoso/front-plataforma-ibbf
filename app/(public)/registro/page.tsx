import type { Metadata } from "next";
import { getTranslations } from "@/hooks/i18n";
import { RegisterForm } from "@/components/auth";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("auth");
  return { title: t("criarConta") };
}

export default function RegisterPage() {
  return <RegisterForm />;
}
