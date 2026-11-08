"use client";

import { toast } from "sonner";
import {
  useTranslations,
  useWatch,
  useFunds,
  useCashAccounts,
  useCreateFinanceTransfer,
  useFinanceTransferForm,
} from "@/hooks";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FormField, FormGrid, FormActions, FormSection } from "@/components/shared/form";
import { FormSkeleton } from "@/components/shared/form-skeleton";
import { getAxiosErrorMessage } from "@/lib/utils/api/getAxiosErrorMessage";
import { parseMoneyToCents } from "@/lib/utils/format/money";
import { scrollToFirstError } from "@/lib/utils/validation/scrollToFirstError";
import type { FinanceTransferFormData } from "@/lib/zod/schemas/financeFormSchemas";
import type { CashAccount, Fund } from "@/lib/types/financeApiTypes";

type TransferFormDialogProps = { open: boolean; onOpenChange: (open: boolean) => void };

export function TransferFormDialog({ open, onOpenChange }: TransferFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">{open && <TransferForm onClose={() => onOpenChange(false)} />}</DialogContent>
    </Dialog>
  );
}

function TransferForm({ onClose }: { onClose: () => void }) {
  const { funds, isLoading: isLoadingFunds } = useFunds();
  const { accounts, isLoading: isLoadingAccounts } = useCashAccounts();

  if (isLoadingFunds || isLoadingAccounts) return <FormSkeleton fields={6} columns={2} />;

  return <TransferFormContent onClose={onClose} funds={funds} accounts={accounts} />;
}

function TransferFormContent({ onClose, funds, accounts }: { onClose: () => void; funds: Fund[]; accounts: CashAccount[] }) {
  const t = useTranslations("financeiro");
  const tValidation = useTranslations("validacao");
  const { createTransfer, isCreating } = useCreateFinanceTransfer();

  // Padrão é o caso mais comum: depositar o dinheiro do caixa no banco, no fundo geral.
  const generalFundId = funds.find((fund) => fund.active && !fund.restricted)?.id ?? "";
  const cashId = accounts.find((account) => account.active && account.kind === "CASH")?.id ?? "";
  const bankId = accounts.find((account) => account.active && account.kind === "BANK")?.id ?? "";
  const { control, handleSubmit } = useFinanceTransferForm(tValidation, {
    fromFundId: generalFundId,
    toFundId: generalFundId,
    fromAccountId: cashId,
    toAccountId: bankId,
  });
  const [fromFundId, toFundId] = useWatch({ control, name: ["fromFundId", "toFundId"] });

  const fundOptions = funds.map((fund) => ({ value: fund.id, label: fund.restricted ? `${fund.name} · ${t("restrito")}` : fund.name }));
  const accountOptions = accounts.map((account) => ({ value: account.id, label: account.name }));

  const onSubmit = async (data: FinanceTransferFormData) => {
    try {
      await createTransfer({
        date: data.date,
        amountCents: parseMoneyToCents(data.amount),
        from: { fundId: data.fromFundId, cashAccountId: data.fromAccountId },
        to: { fundId: data.toFundId, cashAccountId: data.toAccountId },
        description: data.description || undefined,
        approvalReference: data.approvalReference || undefined,
      });
      toast.success(t("transferenciaRegistrada"));
      onClose();
    } catch (error) {
      toast.error(getAxiosErrorMessage(error));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit, scrollToFirstError)} className="flex flex-col gap-4">
      <DialogHeader>
        <DialogTitle>{t("novaTransferencia")}</DialogTitle>
        <DialogDescription>{t("novaTransferenciaDescricao")}</DialogDescription>
      </DialogHeader>
      <FormGrid columns={2}>
        <FormField control={control} name="date" label={t("data")} type="date" />
        <FormField control={control} name="amount" label={t("valor")} mask="money" placeholder="0,00" />
      </FormGrid>
      <FormSection title={t("origem")}>
        <FormGrid columns={2}>
          <FormField control={control} name="fromAccountId" label={t("conta")} type="select" options={accountOptions} placeholder={t("selecione")} />
          <FormField control={control} name="fromFundId" label={t("fundo")} type="select" options={fundOptions} placeholder={t("selecione")} />
        </FormGrid>
      </FormSection>
      <FormSection title={t("destino")}>
        <FormGrid columns={2}>
          <FormField control={control} name="toAccountId" label={t("conta")} type="select" options={accountOptions} placeholder={t("selecione")} />
          <FormField control={control} name="toFundId" label={t("fundo")} type="select" options={fundOptions} placeholder={t("selecione")} />
        </FormGrid>
      </FormSection>
      {fromFundId !== toFundId && (
        <FormField
          control={control}
          name="approvalReference"
          label={t("referenciaAprovacao")}
          placeholder={t("referenciaAprovacaoPlaceholder")}
        />
      )}
      <FormField control={control} name="description" label={t("descricao")} placeholder={t("descricaoTransferenciaPlaceholder")} />
      <DialogFooter>
        <FormActions onCancel={onClose} isSubmitting={isCreating} />
      </DialogFooter>
    </form>
  );
}
