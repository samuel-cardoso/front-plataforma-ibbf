"use client";

import { toast } from "sonner";
import { Pencil } from "lucide-react";
import { useState, useTranslations, useFunds, useSaveFund, useFundForm } from "@/hooks";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FormField, FormActions } from "@/components/shared/form";
import { DataLoadErrorState, TableSkeleton } from "@/components/shared";
import { getAxiosErrorMessage } from "@/lib/utils/api/getAxiosErrorMessage";
import { scrollToFirstError } from "@/lib/utils/validation/scrollToFirstError";
import type { Fund } from "@/lib/types/financeApiTypes";
import type { FundFormData } from "@/lib/zod/schemas/financeFormSchemas";

export function FundsSettings() {
  const t = useTranslations("financeiro");
  const { funds, isLoading, isError, refetch } = useFunds();
  const [editing, setEditing] = useState<Fund | "new" | null>(null);

  if (isLoading) return <TableSkeleton columns={4} />;
  if (isError) return <DataLoadErrorState onRetry={refetch} />;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">{t("fundosDescricao")}</p>
        <Button onClick={() => setEditing("new")}>{t("novoFundo")}</Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("nome")}</TableHead>
            <TableHead>{t("tipoFundo")}</TableHead>
            <TableHead>{t("pixTxid")}</TableHead>
            <TableHead>{t("status")}</TableHead>
            <TableHead className="w-10" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {funds.map((fund) => (
            <TableRow key={fund.id}>
              <TableCell className="font-medium">{fund.name}</TableCell>
              <TableCell>{fund.restricted ? <Badge variant="outline">{t("restrito")}</Badge> : t("livre")}</TableCell>
              <TableCell className="font-mono text-xs">{fund.pixTxid ?? "—"}</TableCell>
              <TableCell>{fund.active ? t("ativo") : <Badge variant="secondary">{t("inativo")}</Badge>}</TableCell>
              <TableCell>
                <Button variant="ghost" size="icon-sm" onClick={() => setEditing(fund)} aria-label={t("editar")}>
                  <Pencil />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Dialog open={!!editing} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent>
          {editing && <FundForm fund={editing === "new" ? undefined : editing} onClose={() => setEditing(null)} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function FundForm({ fund, onClose }: { fund?: Fund; onClose: () => void }) {
  const t = useTranslations("financeiro");
  const tValidation = useTranslations("validacao");
  const { control, handleSubmit } = useFundForm(tValidation, fund);
  const { createFund, updateFund, isSaving } = useSaveFund();

  const onSubmit = async (data: FundFormData) => {
    try {
      if (fund) {
        await updateFund({ id: fund.id, data: { name: data.name, pixTxid: data.pixTxid || null, active: data.active } });
      } else {
        await createFund({ name: data.name, restricted: data.restricted, pixTxid: data.pixTxid || undefined });
      }
      onClose();
    } catch (error) {
      toast.error(getAxiosErrorMessage(error));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit, scrollToFirstError)} className="flex flex-col gap-4">
      <DialogHeader>
        <DialogTitle>{fund ? t("editarFundo") : t("novoFundo")}</DialogTitle>
        <DialogDescription>{t("fundoFormDescricao")}</DialogDescription>
      </DialogHeader>
      <FormField control={control} name="name" label={t("nome")} placeholder={t("fundoNomePlaceholder")} />
      <FormField control={control} name="pixTxid" label={t("pixTxid")} placeholder="MISSOES" />
      {/* A natureza restrita não muda depois de criada: mudaria o que pode ser gasto com dinheiro já recebido. */}
      <FormField control={control} name="restricted" label={t("fundoRestritoLabel")} type="checkbox" disabled={!!fund} />
      {fund && <FormField control={control} name="active" label={t("ativo")} type="checkbox" />}
      <DialogFooter>
        <FormActions onCancel={onClose} isSubmitting={isSaving} />
      </DialogFooter>
    </form>
  );
}
