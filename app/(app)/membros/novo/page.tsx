import type { Metadata } from "next";
import { getTranslations } from "@/hooks/i18n";
import { MemberFormCreate } from "@/components/members";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("membros");
  return { title: t("novoMembro") };
}

export default function NewMemberPage() {
  return <MemberFormCreate />;
}
