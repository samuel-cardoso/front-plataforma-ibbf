import type { Metadata } from "next";
import { getTranslations } from "@/hooks/i18n";
import { MinistryFormCreate } from "@/components/ministries";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("ministerios");
  return { title: t("novoMinisterio") };
}

export default function NewMinistryPage() {
  return <MinistryFormCreate />;
}
