import type { Metadata } from "next";
import { getTranslations } from "@/hooks/i18n";
import { FinanceAccessGate, TransactionsPageContent } from "@/components/finance";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("financeiro");
  return { title: t("lancamentos") };
}

export default function FinanceTransactionsPage() {
  return (
    <FinanceAccessGate require="read">
      <TransactionsPageContent />
    </FinanceAccessGate>
  );
}
