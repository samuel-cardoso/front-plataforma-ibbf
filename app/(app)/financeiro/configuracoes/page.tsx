import type { Metadata } from "next";
import { getTranslations } from "@/hooks/i18n";
import { FinanceAccessGate, FinanceSettings } from "@/components/finance";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("financeiro");
  return { title: t("configuracoes") };
}

export default function FinanceSettingsPage() {
  return (
    <FinanceAccessGate require="readOrManage">
      <FinanceSettings />
    </FinanceAccessGate>
  );
}
