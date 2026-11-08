"use client";

import type { ReactNode } from "react";
import { LockKeyhole } from "lucide-react";
import { useTranslations, useFinanceMe } from "@/hooks";
import { EmptyState, TableSkeleton } from "@/components/shared";
import { FinanceNav } from "./FinanceNav";

type FinanceAccessGateProps = {
  /** `read`: tesoureiro, conselho fiscal ou pastor. `manage`: quem atribui papéis (Pastor Titular). */
  require: "read" | "readOrManage";
  children: ReactNode;
};

/**
 * Esconde o conteúdo do financeiro de quem não tem papel financeiro. É só UX: a autorização
 * real acontece no backend (`authorizeFinance`), que responde 403 de qualquer forma.
 */
export function FinanceAccessGate({ require, children }: FinanceAccessGateProps) {
  const t = useTranslations("financeiro");
  const { canRead, canManageRoles, isLoading } = useFinanceMe();

  if (isLoading) return <TableSkeleton columns={4} />;

  const allowed = require === "read" ? canRead : canRead || canManageRoles;
  if (!allowed) return <EmptyState icon={LockKeyhole} message={t("semAcesso")} />;

  return (
    <div className="flex flex-col gap-6">
      <FinanceNav />
      {children}
    </div>
  );
}
