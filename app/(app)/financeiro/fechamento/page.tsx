import type { Metadata } from "next";
import { getTranslations } from "@/hooks/i18n";
import { FinanceAccessGate, PeriodsPageContent } from "@/components/finance";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("financeiro");
  return { title: t("fechamento") };
}

export default function FinancePeriodsPage() {
  return (
    <FinanceAccessGate require="read">
      <PeriodsPageContent />
    </FinanceAccessGate>
  );
}
