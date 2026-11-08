import type { Metadata } from "next";
import { getTranslations } from "@/hooks/i18n";
import { SongDetail } from "@/components/content";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("canticos");
  return { title: t("titulo") };
}

type PageProps = { params: Promise<{ id: string }> };

export default async function CanticlePage({ params }: PageProps) {
  const { id } = await params;
  return <SongDetail kind="canticles" id={Number(id)} />;
}
