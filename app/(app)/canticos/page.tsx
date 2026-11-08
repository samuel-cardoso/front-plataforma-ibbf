import type { Metadata } from "next";
import { getTranslations } from "@/hooks/i18n";
import { SongsPageContent } from "@/components/content";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("canticos");
  return { title: t("titulo") };
}

export default function CanticlesPage() {
  return <SongsPageContent kind="canticles" />;
}
