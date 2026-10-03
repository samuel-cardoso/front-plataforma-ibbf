import type { ComponentType, ReactNode } from "react";
import { Inbox } from "lucide-react";
import { useTranslations } from "@/hooks";

type EmptyStateProps = {
  icon?: ComponentType<{ className?: string }>;
  message?: string;
  action?: ReactNode;
};

export function EmptyState({ icon: Icon = Inbox, message, action }: EmptyStateProps) {
  const t = useTranslations("comum");

  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-lg bg-muted/30 py-16 text-center">
      <div className="flex size-11 items-center justify-center rounded-full bg-muted">
        <Icon className="size-5 text-muted-foreground" />
      </div>
      <p className="text-sm text-muted-foreground">{message ?? t("semResultados")}</p>
      {action}
    </div>
  );
}
