import { z } from "zod";
import { parseMoneyToCents } from "@/lib/utils/format/money";

type ValidationT = (key: string) => string;

const amountField = (t: ValidationT) =>
  z.string().refine((value) => parseMoneyToCents(value) > 0, t("valorMaiorQueZero"));

export const financeTransactionFormSchema = (t: ValidationT) =>
  z
    .object({
      kind: z.enum(["INCOME", "EXPENSE", "OPENING_BALANCE"]),
      date: z.string().min(1, t("campoObrigatorio")),
      amount: amountField(t),
      fundId: z.string().min(1, t("campoObrigatorio")),
      cashAccountId: z.string().min(1, t("campoObrigatorio")),
      categoryId: z.string(),
      method: z.string(),
      memberId: z.string(),
      description: z.string().trim().max(500).optional(),
      documentNumber: z.string().trim().max(100).optional(),
    })
    .superRefine((data, ctx) => {
      if (data.kind !== "OPENING_BALANCE" && !data.categoryId) {
        ctx.addIssue({ code: "custom", path: ["categoryId"], message: t("campoObrigatorio") });
      }
    });

export type FinanceTransactionFormData = z.infer<ReturnType<typeof financeTransactionFormSchema>>;

export const financeTransferFormSchema = (t: ValidationT) =>
  z
    .object({
      date: z.string().min(1, t("campoObrigatorio")),
      amount: amountField(t),
      fromFundId: z.string().min(1, t("campoObrigatorio")),
      fromAccountId: z.string().min(1, t("campoObrigatorio")),
      toFundId: z.string().min(1, t("campoObrigatorio")),
      toAccountId: z.string().min(1, t("campoObrigatorio")),
      description: z.string().trim().max(500).optional(),
      approvalReference: z.string().trim().max(200).optional(),
    })
    .superRefine((data, ctx) => {
      if (data.fromFundId === data.toFundId && data.fromAccountId === data.toAccountId) {
        ctx.addIssue({ code: "custom", path: ["toAccountId"], message: t("origemDestinoIguais") });
      }
      if (data.fromFundId !== data.toFundId && !data.approvalReference) {
        ctx.addIssue({ code: "custom", path: ["approvalReference"], message: t("aprovacaoObrigatoria") });
      }
    });

export type FinanceTransferFormData = z.infer<ReturnType<typeof financeTransferFormSchema>>;

export const financeReasonFormSchema = (t: ValidationT) =>
  z.object({ reason: z.string().trim().min(1, t("campoObrigatorio")).max(300) });

export type FinanceReasonFormData = z.infer<ReturnType<typeof financeReasonFormSchema>>;

export const fundFormSchema = (t: ValidationT) =>
  z.object({
    name: z.string().trim().min(1, t("campoObrigatorio")),
    restricted: z.boolean(),
    pixTxid: z
      .string()
      .trim()
      .refine((value) => !value || /^[A-Za-z0-9]{1,25}$/.test(value), t("pixTxidInvalido")),
    active: z.boolean(),
  });

export type FundFormData = z.infer<ReturnType<typeof fundFormSchema>>;

export const financeCategoryFormSchema = (t: ValidationT) =>
  z.object({
    name: z.string().trim().min(1, t("campoObrigatorio")),
    type: z.enum(["INCOME", "EXPENSE"]),
    accountingCode: z.string().trim().optional(),
    active: z.boolean(),
  });

export type FinanceCategoryFormData = z.infer<ReturnType<typeof financeCategoryFormSchema>>;

export const cashAccountFormSchema = (t: ValidationT) =>
  z.object({
    name: z.string().trim().min(1, t("campoObrigatorio")),
    kind: z.enum(["CASH", "BANK"]),
    bankName: z.string().trim().optional(),
    active: z.boolean(),
  });

export type CashAccountFormData = z.infer<ReturnType<typeof cashAccountFormSchema>>;
