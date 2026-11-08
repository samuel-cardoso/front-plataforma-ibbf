import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  cashAccountFormSchema,
  financeCategoryFormSchema,
  financeReasonFormSchema,
  financeTransactionFormSchema,
  financeTransferFormSchema,
  fundFormSchema,
  type CashAccountFormData,
  type FinanceCategoryFormData,
  type FinanceReasonFormData,
  type FinanceTransactionFormData,
  type FinanceTransferFormData,
  type FundFormData,
} from "@/lib/zod/schemas/financeFormSchemas";
import type { CashAccount, FinanceCategory, FinanceCategoryType, Fund } from "@/lib/types/financeApiTypes";

type T = (key: string) => string;

/** Data de hoje no fuso local, no formato do DatePicker (yyyy-MM-dd). */
export function todayIso(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

export function useFinanceTransactionForm(t: T, defaults: Partial<FinanceTransactionFormData> = {}) {
  return useForm<FinanceTransactionFormData>({
    resolver: zodResolver(financeTransactionFormSchema(t)),
    defaultValues: {
      kind: "INCOME",
      date: todayIso(),
      amount: "",
      fundId: "",
      cashAccountId: "",
      categoryId: "",
      method: "none",
      memberId: "none",
      description: "",
      documentNumber: "",
      ...defaults,
    },
  });
}

export function useFinanceTransferForm(t: T, defaults: Partial<FinanceTransferFormData> = {}) {
  return useForm<FinanceTransferFormData>({
    resolver: zodResolver(financeTransferFormSchema(t)),
    defaultValues: {
      date: todayIso(),
      amount: "",
      fromFundId: "",
      fromAccountId: "",
      toFundId: "",
      toAccountId: "",
      description: "",
      approvalReference: "",
      ...defaults,
    },
  });
}

export function useFinanceReasonForm(t: T) {
  return useForm<FinanceReasonFormData>({
    resolver: zodResolver(financeReasonFormSchema(t)),
    defaultValues: { reason: "" },
  });
}

export function useFundForm(t: T, fund?: Fund) {
  return useForm<FundFormData>({
    resolver: zodResolver(fundFormSchema(t)),
    defaultValues: {
      name: fund?.name ?? "",
      restricted: fund?.restricted ?? false,
      pixTxid: fund?.pixTxid ?? "",
      active: fund?.active ?? true,
    },
  });
}

export function useFinanceCategoryForm(t: T, category?: FinanceCategory, type: FinanceCategoryType = "INCOME") {
  return useForm<FinanceCategoryFormData>({
    resolver: zodResolver(financeCategoryFormSchema(t)),
    defaultValues: {
      name: category?.name ?? "",
      type: category?.type ?? type,
      accountingCode: category?.accountingCode ?? "",
      active: category?.active ?? true,
    },
  });
}

export function useCashAccountForm(t: T, account?: CashAccount) {
  return useForm<CashAccountFormData>({
    resolver: zodResolver(cashAccountFormSchema(t)),
    defaultValues: {
      name: account?.name ?? "",
      kind: account?.kind ?? "BANK",
      bankName: account?.bankName ?? "",
      active: account?.active ?? true,
    },
  });
}
