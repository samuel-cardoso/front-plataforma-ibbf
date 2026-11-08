import type { ListParams } from "./apiEnvelopeTypes";

export type FinanceRole = "TREASURER" | "FISCAL_COUNCIL" | "PASTOR_VIEWER" | "COUNTER";
export type FinanceCategoryType = "INCOME" | "EXPENSE";
export type CashAccountKind = "CASH" | "BANK";
export type FinanceTransactionKind = "INCOME" | "EXPENSE" | "TRANSFER" | "OPENING_BALANCE";
export type PaymentMethod = "CASH" | "PIX" | "CARD" | "BANK_TRANSFER" | "CHECK" | "BOLETO";
export type FinancePeriodStatus = "OPEN" | "CLOSED";

export type FinanceMe = {
  financeRole: { role: FinanceRole; canViewIndividualGiving: boolean } | null;
  canManageRoles: boolean;
};

export type Fund = {
  id: string;
  name: string;
  restricted: boolean;
  active: boolean;
  pixTxid: string | null;
  sortOrder: number;
  createdAt: string;
};

export type FundCreateInput = { name: string; restricted?: boolean; pixTxid?: string; sortOrder?: number };
export type FundUpdateInput = { name?: string; active?: boolean; pixTxid?: string | null; sortOrder?: number };

export type FinanceCategory = {
  id: string;
  name: string;
  type: FinanceCategoryType;
  parentId: string | null;
  accountingCode: string | null;
  active: boolean;
  createdAt: string;
};

export type FinanceCategoryCreateInput = {
  name: string;
  type: FinanceCategoryType;
  parentId?: string;
  accountingCode?: string;
};
export type FinanceCategoryUpdateInput = {
  name?: string;
  parentId?: string | null;
  accountingCode?: string | null;
  active?: boolean;
};

export type CashAccount = {
  id: string;
  name: string;
  kind: CashAccountKind;
  bankName: string | null;
  active: boolean;
  createdAt: string;
};

export type CashAccountCreateInput = { name: string; kind: CashAccountKind; bankName?: string };
export type CashAccountUpdateInput = { name?: string; bankName?: string | null; active?: boolean };

export type FinanceTransaction = {
  id: string;
  kind: FinanceTransactionKind;
  date: string;
  /** Com sinal: positivo entra, negativo sai. */
  amountCents: number;
  description: string | null;
  fundId: string;
  fundName: string | null;
  cashAccountId: string;
  cashAccountName: string | null;
  categoryId: string | null;
  categoryName: string | null;
  method: PaymentMethod | null;
  memberId: string | null;
  memberName: string | null;
  hasMember: boolean;
  documentNumber: string | null;
  transferGroupId: string | null;
  approvalReference: string | null;
  reversesId: string | null;
  reversedById: string | null;
  createdAt: string;
};

export type FinanceTransactionListParams = ListParams & {
  from?: string;
  to?: string;
  fundId?: string;
  cashAccountId?: string;
  categoryId?: string;
  kind?: FinanceTransactionKind;
};

export type FinanceTransactionCreateInput = {
  kind: "INCOME" | "EXPENSE" | "OPENING_BALANCE";
  date: string;
  amountCents: number;
  fundId: string;
  cashAccountId: string;
  categoryId?: string;
  method?: PaymentMethod;
  memberId?: string;
  description?: string;
  documentNumber?: string;
};

export type FinanceTransferInput = {
  date: string;
  amountCents: number;
  from: { fundId: string; cashAccountId: string };
  to: { fundId: string; cashAccountId: string };
  description?: string;
  approvalReference?: string;
};

export type FinanceReverseInput = { reason: string; date?: string };

type NamedAmount = { id: string; name: string; amountCents: number };

export type FinanceSummary = {
  period: { year: number; month: number; status: FinancePeriodStatus };
  balances: {
    funds: { id: string; name: string; restricted: boolean; balanceCents: number }[];
    accounts: { id: string; name: string; kind: CashAccountKind; balanceCents: number }[];
    totalCents: number;
  };
  month: {
    incomeByFund: NamedAmount[];
    incomeByCategory: NamedAmount[];
    expenseByCategory: NamedAmount[];
    totalIncomeCents: number;
    totalExpenseCents: number;
  };
};

export type FinancePeriod = {
  year: number;
  month: number;
  status: FinancePeriodStatus;
  closedById: string | null;
  closedAt: string | null;
  reopenReason: string | null;
};

export type FinanceUser = {
  userId: string;
  email: string;
  roleName: string;
  memberName: string | null;
  financeRole: FinanceRole | null;
  canViewIndividualGiving: boolean;
};

export type FinanceRoleAssignInput = { role: FinanceRole; canViewIndividualGiving: boolean };
