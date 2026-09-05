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
};

export function ConfirmDeleteDialog({
  open,
  onOpenChange,
  onConfirm,
  isDeleting,
  title,
  description,
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
          <AlertDialogAction variant="destructive" disabled={isDeleting} onClick={onConfirm}>
            {isDeleting ? t("excluindo") : t("excluir")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
