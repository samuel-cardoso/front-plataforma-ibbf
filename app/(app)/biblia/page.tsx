import { Suspense } from "react";
import type { Metadata } from "next";
import { getTranslations } from "@/hooks/i18n";
import { BibleReader } from "@/components/content";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("biblia");
  return { title: t("titulo") };
}

export default function BiblePage() {
  // useSearchParams no leitor exige um limite de Suspense na página.
  return (
    <Suspense>
      <BibleReader />
    </Suspense>
  );
}
