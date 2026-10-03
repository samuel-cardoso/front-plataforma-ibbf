import { CircleAlert } from "lucide-react";
import { useTranslations } from "@/hooks";
import { Button } from "@/components/ui/button";

type DataLoadErrorStateProps = {
  onRetry?: () => void;
};

export function DataLoadErrorState({ onRetry }: DataLoadErrorStateProps) {
  const t = useTranslations("comum");

  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-lg bg-destructive/5 py-16 text-center">
      <div className="flex size-11 items-center justify-center rounded-full bg-destructive/10">
        <CircleAlert className="size-5 text-destructive" />
      </div>
      <p className="text-sm text-destructive">{t("erroAoCarregar")}</p>
      {onRetry && (
        <Button type="button" variant="outline" size="sm" onClick={onRetry}>
          {t("tentarNovamente")}
        </Button>
      )}
    </div>
  );
}
