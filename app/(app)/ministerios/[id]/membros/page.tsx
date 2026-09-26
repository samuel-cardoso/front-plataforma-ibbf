import type { Metadata } from "next";
import { getTranslations } from "@/hooks/i18n";
import { MinistryMembersPageContent } from "@/components/ministries";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("ministerios");
  return { title: t("participantes") };
}

type PageProps = { params: Promise<{ id: string }> };

export default async function MinistryMembersPage({ params }: PageProps) {
  const { id } = await params;
  return <MinistryMembersPageContent ministryId={id} />;
}
