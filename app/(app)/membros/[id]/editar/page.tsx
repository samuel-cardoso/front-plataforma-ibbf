import type { Metadata } from "next";
import { getTranslations } from "@/hooks/i18n";
import { MemberFormEdit } from "@/components/members";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("membros");
  return { title: t("editarMembro") };
}

type PageProps = { params: Promise<{ id: string }> };

export default async function EditMemberPage({ params }: PageProps) {
  const { id } = await params;
  return <MemberFormEdit memberId={id} />;
}
