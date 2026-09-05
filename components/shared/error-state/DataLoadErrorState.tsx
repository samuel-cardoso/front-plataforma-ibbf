import { useTranslations } from "@/hooks";
import { Button } from "@/components/ui/button";

type DataLoadErrorStateProps = {
  onRetry?: () => void;
};

export function DataLoadErrorState({ onRetry }: DataLoadErrorStateProps) {
  const t = useTranslations("comum");

  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed py-12 text-center">
      <p className="text-sm text-destructive">{t("erroAoCarregar")}</p>
      {onRetry && (
        <Button type="button" variant="outline" size="sm" onClick={onRetry}>
          {t("tentarNovamente")}
        </Button>
      )}
    </div>
  );
}
