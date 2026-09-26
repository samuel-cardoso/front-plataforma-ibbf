import type { Metadata } from "next";
import { getTranslations } from "@/hooks/i18n";
import { MinistryFormEdit } from "@/components/ministries";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("ministerios");
  return { title: t("editarMinisterio") };
}

type PageProps = { params: Promise<{ id: string }> };

export default async function EditMinistryPage({ params }: PageProps) {
  const { id } = await params;
  return <MinistryFormEdit ministryId={id} />;
}
