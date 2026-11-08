import type { FinanceRole, PaymentMethod } from "@/lib/types/financeApiTypes";

export const PAYMENT_METHOD_VALUES: PaymentMethod[] = ["CASH", "PIX", "CARD", "BANK_TRANSFER", "CHECK", "BOLETO"];

/** COUNTER fica de fora até existir a contagem de culto (próxima fatia do MVP). */
export const ASSIGNABLE_FINANCE_ROLES: FinanceRole[] = ["TREASURER", "FISCAL_COUNCIL", "PASTOR_VIEWER"];

export const FINANCE_TRANSACTIONS_PAGE_SIZE = 25;
