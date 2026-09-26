import type { Metadata } from "next";
import { getTranslations } from "@/hooks/i18n";
import { FamilyFormEdit } from "@/components/families";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("familias");
  return { title: t("editarFamilia") };
}

type PageProps = { params: Promise<{ id: string }> };

export default async function EditFamilyPage({ params }: PageProps) {
  const { id } = await params;
  return <FamilyFormEdit familyId={id} />;
}
