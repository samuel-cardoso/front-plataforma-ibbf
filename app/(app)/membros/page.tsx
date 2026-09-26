import type { Metadata } from "next";
import { getTranslations } from "@/hooks/i18n";
import { MembersPageContent } from "@/components/members";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("membros");
  return { title: t("titulo") };
}

export default function MembersPage() {
  return <MembersPageContent />;
}
