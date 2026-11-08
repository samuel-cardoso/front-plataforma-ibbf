"use client";

import { useTranslations } from "@/hooks";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type ConfirmDeleteDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isDeleting?: boolean;
  title?: string;
  description?: string;
  /** Para confirmações que não são exclusão (ex.: fechar o mês). */
  confirmLabel?: string;
  pendingLabel?: string;
  variant?: "destructive" | "default";
};

export function ConfirmDeleteDialog({
  open,
  onOpenChange,
  onConfirm,
  isDeleting,
  title,
  description,
  confirmLabel,
  pendingLabel,
  variant = "destructive",
}: ConfirmDeleteDialogProps) {
  const t = useTranslations("comum");

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title ?? t("confirmarExclusaoTitulo")}</AlertDialogTitle>
          <AlertDialogDescription>
            {description ?? t("confirmarExclusaoDescricao")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>{t("cancelar")}</AlertDialogCancel>
          <AlertDialogAction variant={variant} disabled={isDeleting} onClick={onConfirm}>
            {isDeleting ? (pendingLabel ?? t("excluindo")) : (confirmLabel ?? t("excluir"))}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
