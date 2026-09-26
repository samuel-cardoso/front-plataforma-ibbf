import type { Metadata } from "next";
import { getTranslations } from "@/hooks/i18n";
import { FamiliesPageContent } from "@/components/families";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("familias");
  return { title: t("titulo") };
}

export default function FamiliesPage() {
  return <FamiliesPageContent />;
}
