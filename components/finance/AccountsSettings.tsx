"use client";

import { toast } from "sonner";
import { Pencil } from "lucide-react";
import { useState, useTranslations, useCashAccounts, useSaveCashAccount, useCashAccountForm } from "@/hooks";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FormField, FormActions } from "@/components/shared/form";
import { DataLoadErrorState, TableSkeleton } from "@/components/shared";
import { getAxiosErrorMessage } from "@/lib/utils/api/getAxiosErrorMessage";
import { scrollToFirstError } from "@/lib/utils/validation/scrollToFirstError";
import type { CashAccount } from "@/lib/types/financeApiTypes";
import type { CashAccountFormData } from "@/lib/zod/schemas/financeFormSchemas";

export function AccountsSettings() {
  const t = useTranslations("financeiro");
  const { accounts, isLoading, isError, refetch } = useCashAccounts();
  const [editing, setEditing] = useState<CashAccount | "new" | null>(null);

  if (isLoading) return <TableSkeleton columns={3} />;
  if (isError) return <DataLoadErrorState onRetry={refetch} />;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">{t("contasDescricao")}</p>
        <Button onClick={() => setEditing("new")}>{t("novaConta")}</Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("nome")}</TableHead>
            <TableHead>{t("tipoConta")}</TableHead>
            <TableHead>{t("banco")}</TableHead>
            <TableHead>{t("status")}</TableHead>
            <TableHead className="w-10" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {accounts.map((account) => (
            <TableRow key={account.id}>
              <TableCell className="font-medium">{account.name}</TableCell>
              <TableCell>{t(`conta${account.kind}`)}</TableCell>
              <TableCell>{account.bankName ?? "—"}</TableCell>
              <TableCell>{account.active ? t("ativo") : <Badge variant="secondary">{t("inativo")}</Badge>}</TableCell>
              <TableCell>
                <Button variant="ghost" size="icon-sm" onClick={() => setEditing(account)} aria-label={t("editar")}>
                  <Pencil />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Dialog open={!!editing} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent>
          {editing && <AccountForm account={editing === "new" ? undefined : editing} onClose={() => setEditing(null)} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function AccountForm({ account, onClose }: { account?: CashAccount; onClose: () => void }) {
  const t = useTranslations("financeiro");
  const tValidation = useTranslations("validacao");
  const { control, handleSubmit } = useCashAccountForm(tValidation, account);
  const { createAccount, updateAccount, isSaving } = useSaveCashAccount();
  const kindOptions = (["CASH", "BANK"] as const).map((value) => ({ value, label: t(`conta${value}`) }));

  const onSubmit = async (data: CashAccountFormData) => {
    try {
      if (account) {
        await updateAccount({ id: account.id, data: { name: data.name, bankName: data.bankName || null, active: data.active } });
      } else {
        await createAccount({ name: data.name, kind: data.kind, bankName: data.bankName || undefined });
      }
      onClose();
    } catch (error) {
      toast.error(getAxiosErrorMessage(error));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit, scrollToFirstError)} className="flex flex-col gap-4">
      <DialogHeader>
        <DialogTitle>{account ? t("editarConta") : t("novaConta")}</DialogTitle>
      </DialogHeader>
      <FormField control={control} name="name" label={t("nome")} placeholder={t("contaNomePlaceholder")} />
      <FormField control={control} name="kind" label={t("tipoConta")} type="select" options={kindOptions} disabled={!!account} />
      <FormField control={control} name="bankName" label={t("banco")} placeholder="Sicredi" />
      {account && <FormField control={control} name="active" label={t("ativo")} type="checkbox" />}
      <DialogFooter>
        <FormActions onCancel={onClose} isSubmitting={isSaving} />
      </DialogFooter>
    </form>
  );
}
