import { useTranslations } from "@/hooks";
import { Button } from "@/components/ui/button";

type FormActionsProps = {
  onCancel: () => void;
  isSubmitting?: boolean;
  submitLabel?: string;
  submittingLabel?: string;
};

export function FormActions({
  onCancel,
  isSubmitting,
  submitLabel,
  submittingLabel,
}: FormActionsProps) {
  const t = useTranslations("comum");

  return (
    <div className="flex justify-end gap-2 border-t pt-4">
      <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
        {t("cancelar")}
      </Button>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? (submittingLabel ?? t("salvando")) : (submitLabel ?? t("salvar"))}
      </Button>
    </div>
  );
}
