"use client";

import { toast } from "sonner";
import {
  useTranslations,
  useWatch,
  useFinanceMe,
  useFunds,
  useCashAccounts,
  useFinanceCategories,
  useMembers,
  useCreateFinanceTransaction,
  useFinanceTransactionForm,
} from "@/hooks";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FormField, FormGrid, FormActions } from "@/components/shared/form";
import { FormSkeleton } from "@/components/shared/form-skeleton";
import { PAYMENT_METHOD_VALUES } from "@/lib/consts/finance";
import { getAxiosErrorMessage } from "@/lib/utils/api/getAxiosErrorMessage";
import { parseMoneyToCents } from "@/lib/utils/format/money";
import { scrollToFirstError } from "@/lib/utils/validation/scrollToFirstError";
import type { FinanceTransactionFormData } from "@/lib/zod/schemas/financeFormSchemas";
import type { CashAccount, Fund, PaymentMethod } from "@/lib/types/financeApiTypes";

type TransactionFormDialogProps = {
  kind: FinanceTransactionFormData["kind"];
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function TransactionFormDialog({ kind, open, onOpenChange }: TransactionFormDialogProps) {
  // Remonta o formulário a cada abertura para começar sempre limpo e com o tipo certo.
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        {open && <TransactionForm kind={kind} onClose={() => onOpenChange(false)} />}
      </DialogContent>
    </Dialog>
  );
}

type TransactionFormProps = { kind: FinanceTransactionFormData["kind"]; onClose: () => void };

function TransactionForm(props: TransactionFormProps) {
  const { funds, isLoading: isLoadingFunds } = useFunds();
  const { accounts, isLoading: isLoadingAccounts } = useCashAccounts();

  if (isLoadingFunds || isLoadingAccounts) return <FormSkeleton fields={6} columns={2} />;

  return <TransactionFormContent {...props} funds={funds} accounts={accounts} />;
}

function TransactionFormContent({
  kind,
  onClose,
  funds,
  accounts,
}: TransactionFormProps & { funds: Fund[]; accounts: CashAccount[] }) {
  const t = useTranslations("financeiro");
  const tValidation = useTranslations("validacao");
  const { financeRole } = useFinanceMe();
  const canIdentify = kind === "INCOME" && !!financeRole?.canViewIndividualGiving;

  const categoryType = kind === "EXPENSE" ? "EXPENSE" : "INCOME";
  const { categories } = useFinanceCategories(categoryType, kind !== "OPENING_BALANCE");
  const { members } = useMembers({ limit: 100 }, canIdentify);
  const { createTransaction, isCreating } = useCreateFinanceTransaction();

  // Padrão: fundo geral (não restrito) e a primeira conta ativa (normalmente o Caixa).
  const { control, handleSubmit } = useFinanceTransactionForm(tValidation, {
    kind,
    fundId: funds.find((fund) => fund.active && !fund.restricted)?.id ?? "",
    cashAccountId: accounts.find((account) => account.active)?.id ?? "",
  });
  const fundId = useWatch({ control, name: "fundId" });

  const fundOptions = funds
    .filter((fund) => fund.active)
    .map((fund) => ({ value: fund.id, label: fund.restricted ? `${fund.name} · ${t("restrito")}` : fund.name }));
  const accountOptions = accounts.filter((account) => account.active).map((account) => ({ value: account.id, label: account.name }));
  const categoryOptions = categories.filter((category) => category.active).map((category) => ({ value: category.id, label: category.name }));
  const methodOptions = [
    { value: "none", label: t("naoInformado") },
    ...PAYMENT_METHOD_VALUES.map((value) => ({ value, label: t(`metodo${value}`) })),
  ];
  const memberOptions = [
    { value: "none", label: t("contribuicaoAnonima") },
    ...members.map((member) => ({ value: member.id, label: member.fullName })),
  ];
  const selectedFund = funds.find((fund) => fund.id === fundId);

  const onSubmit = async (data: FinanceTransactionFormData) => {
    try {
      await createTransaction({
        kind: data.kind,
        date: data.date,
        amountCents: parseMoneyToCents(data.amount),
        fundId: data.fundId,
        cashAccountId: data.cashAccountId,
        categoryId: data.kind === "OPENING_BALANCE" ? undefined : data.categoryId,
        method: data.method !== "none" ? (data.method as PaymentMethod) : undefined,
        memberId: canIdentify && data.memberId !== "none" ? data.memberId : undefined,
        description: data.description || undefined,
        documentNumber: data.documentNumber || undefined,
      });
      toast.success(t("lancamentoRegistrado"));
      onClose();
    } catch (error) {
      toast.error(getAxiosErrorMessage(error));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit, scrollToFirstError)} className="flex flex-col gap-4">
      <DialogHeader>
        <DialogTitle>{t(`novo${kind}`)}</DialogTitle>
        <DialogDescription>{t(`novo${kind}Descricao`)}</DialogDescription>
      </DialogHeader>
      <FormGrid columns={2}>
        <FormField control={control} name="date" label={t("data")} type="date" />
        <FormField control={control} name="amount" label={t("valor")} mask="money" placeholder="0,00" />
        <FormField control={control} name="fundId" label={t("fundo")} type="select" options={fundOptions} placeholder={t("selecione")} />
        <FormField control={control} name="cashAccountId" label={t("conta")} type="select" options={accountOptions} placeholder={t("selecione")} />
        {kind !== "OPENING_BALANCE" && (
          <FormField control={control} name="categoryId" label={t("categoria")} type="select" options={categoryOptions} placeholder={t("selecione")} />
        )}
        {kind !== "OPENING_BALANCE" && (
          <FormField control={control} name="method" label={t("formaPagamento")} type="select" options={methodOptions} />
        )}
        {canIdentify && (
          <FormField control={control} name="memberId" label={t("contribuinte")} type="select" options={memberOptions} />
        )}
        <FormField control={control} name="documentNumber" label={t("documento")} placeholder={t("documentoPlaceholder")} />
      </FormGrid>
      {selectedFund?.restricted && kind === "EXPENSE" && (
        <p className="rounded-md bg-muted px-3 py-2 text-sm text-muted-foreground">{t("avisoFundoRestrito")}</p>
      )}
      <FormField control={control} name="description" label={t("descricao")} type="textarea" placeholder={t("descricaoPlaceholder")} />
      <DialogFooter>
        <FormActions onCancel={onClose} isSubmitting={isCreating} />
      </DialogFooter>
    </form>
  );
}
