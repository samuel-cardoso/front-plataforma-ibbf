import type { Metadata } from "next";
import { getTranslations } from "@/hooks/i18n";
import { SongDetail } from "@/components/content";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("hinario");
  return { title: t("titulo") };
}

type PageProps = { params: Promise<{ id: string }> };

export default async function HymnPage({ params }: PageProps) {
  const { id } = await params;
  return <SongDetail kind="hymns" id={Number(id)} />;
}
