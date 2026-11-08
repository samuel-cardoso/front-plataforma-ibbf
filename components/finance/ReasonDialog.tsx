"use client";

import { useTranslations, useFinanceReasonForm } from "@/hooks";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FormField, FormActions } from "@/components/shared/form";
import { scrollToFirstError } from "@/lib/utils/validation/scrollToFirstError";

type ReasonDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  onConfirm: (reason: string) => Promise<void>;
  isSubmitting?: boolean;
};

/** Diálogo que exige um motivo antes de uma ação registrada em auditoria (estorno, reabertura). */
export function ReasonDialog({ open, onOpenChange, title, description, onConfirm, isSubmitting }: ReasonDialogProps) {
  const t = useTranslations("financeiro");
  const tValidation = useTranslations("validacao");
  const { control, handleSubmit, reset } = useFinanceReasonForm(tValidation);

  const close = (value: boolean) => {
    if (!value) reset();
    onOpenChange(value);
  };

  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <form
          className="flex flex-col gap-4"
          onSubmit={handleSubmit(async (data) => {
            await onConfirm(data.reason);
            reset();
          }, scrollToFirstError)}
        >
          <FormField control={control} name="reason" label={t("motivo")} type="textarea" placeholder={t("motivoPlaceholder")} />
          <DialogFooter>
            <FormActions onCancel={() => close(false)} isSubmitting={isSubmitting} />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
