import type { ReactNode } from "react";
import { useTranslations } from "@/hooks";

type EmptyStateProps = {
  message?: string;
  action?: ReactNode;
};

export function EmptyState({ message, action }: EmptyStateProps) {
  const t = useTranslations("comum");

  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed py-12 text-center">
      <p className="text-sm text-muted-foreground">{message ?? t("semResultados")}</p>
      {action}
    </div>
  );
}
