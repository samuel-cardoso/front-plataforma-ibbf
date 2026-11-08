"use client";

import { useTranslations, useFinanceMe } from "@/hooks";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FundsSettings } from "./FundsSettings";
import { CategoriesSettings } from "./CategoriesSettings";
import { AccountsSettings } from "./AccountsSettings";
import { FinanceAccessSettings } from "./FinanceAccessSettings";

export function FinanceSettings() {
  const t = useTranslations("financeiro");
  const { canWrite, canManageRoles } = useFinanceMe();

  const tabs = [
    { value: "fundos", label: t("fundos"), visible: canWrite, content: <FundsSettings /> },
    { value: "categorias", label: t("planoDeContas"), visible: canWrite, content: <CategoriesSettings /> },
    { value: "contas", label: t("contas"), visible: canWrite, content: <AccountsSettings /> },
    { value: "acesso", label: t("acesso"), visible: canManageRoles, content: <FinanceAccessSettings /> },
  ].filter((tab) => tab.visible);

  if (tabs.length === 0) return null;

  return (
    <Tabs defaultValue={tabs[0]?.value}>
      <TabsList>
        {tabs.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map((tab) => (
        <TabsContent key={tab.value} value={tab.value} className="pt-4">
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  );
}
