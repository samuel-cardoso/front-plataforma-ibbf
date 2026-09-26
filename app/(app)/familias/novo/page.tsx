import type { Metadata } from "next";
import { getTranslations } from "@/hooks/i18n";
import { FamilyFormCreate } from "@/components/families";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("familias");
  return { title: t("novaFamilia") };
}

export default function NewFamilyPage() {
  return <FamilyFormCreate />;
}
