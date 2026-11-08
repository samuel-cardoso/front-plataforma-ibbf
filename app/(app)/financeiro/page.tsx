import type { Metadata } from "next";
import { getTranslations } from "@/hooks/i18n";
import { FinanceAccessGate, FinanceDashboard } from "@/components/finance";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("financeiro");
  return { title: t("titulo") };
}

export default function FinanceDashboardPage() {
  return (
    <FinanceAccessGate require="read">
      <FinanceDashboard />
    </FinanceAccessGate>
  );
}
