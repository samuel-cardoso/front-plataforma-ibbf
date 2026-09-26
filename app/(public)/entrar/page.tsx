import type { Metadata } from "next";
import { getTranslations } from "@/hooks/i18n";
import { LoginForm } from "@/components/auth";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("auth");
  return { title: t("entrar") };
}

export default function LoginPage() {
  return <LoginForm />;
}
