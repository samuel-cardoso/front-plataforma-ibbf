import type { Metadata } from "next";
import { getTranslations } from "@/hooks/i18n";
import { MinistriesPageContent } from "@/components/ministries";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("ministerios");
  return { title: t("titulo") };
}

export default function MinistriesPage() {
  return <MinistriesPageContent />;
}
