import { bffApi } from "@/infra/api/config/bff-api.config";
import { buildListParams } from "@/infra/api/helpers/query-params.helper";
import type { PaginatedResult } from "@/lib/types/apiEnvelopeTypes";
import type {
  CashAccount,
  CashAccountCreateInput,
  CashAccountUpdateInput,
  FinanceCategory,
  FinanceCategoryCreateInput,
  FinanceCategoryType,
  FinanceCategoryUpdateInput,
  FinanceMe,
  FinancePeriod,
  FinanceReverseInput,
  FinanceRoleAssignInput,
  FinanceSummary,
  FinanceTransaction,
  FinanceTransactionCreateInput,
  FinanceTransactionListParams,
  FinanceTransferInput,
  FinanceUser,
  Fund,
  FundCreateInput,
  FundUpdateInput,
} from "@/lib/types/financeApiTypes";

// O backend do financeiro já devolve os shapes finais (validados por Zod na saída),
// então aqui não há mapper: só desembrulhamos o envelope `{ success, data }`.
export const financeService = {
  me: async (): Promise<FinanceMe> => (await bffApi.get("/finance/me")).data.data,

  listUsers: async (): Promise<FinanceUser[]> => (await bffApi.get("/finance/users")).data.data.users,
  assignRole: async (userId: string, input: FinanceRoleAssignInput) =>
    (await bffApi.put(`/finance/users/${userId}/role`, input)).data.data.financeRole,
  revokeRole: async (userId: string): Promise<void> => {
    await bffApi.delete(`/finance/users/${userId}/role`);
  },

  listFunds: async (): Promise<Fund[]> => (await bffApi.get("/finance/funds")).data.data.funds,
  createFund: async (input: FundCreateInput): Promise<Fund> =>
    (await bffApi.post("/finance/funds", input)).data.data.fund,
  updateFund: async (id: string, input: FundUpdateInput): Promise<Fund> =>
    (await bffApi.patch(`/finance/funds/${id}`, input)).data.data.fund,

  listCategories: async (type?: FinanceCategoryType): Promise<FinanceCategory[]> => {
    const response = await bffApi.get("/finance/categories", { params: type ? { type } : {} });
    // Ordena no cliente: a collation do Postgres põe "Água" depois de "Z".
    return (response.data.data.categories as FinanceCategory[]).sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
  },
  createCategory: async (input: FinanceCategoryCreateInput): Promise<FinanceCategory> =>
    (await bffApi.post("/finance/categories", input)).data.data.category,
  updateCategory: async (id: string, input: FinanceCategoryUpdateInput): Promise<FinanceCategory> =>
    (await bffApi.patch(`/finance/categories/${id}`, input)).data.data.category,

  listAccounts: async (): Promise<CashAccount[]> => (await bffApi.get("/finance/accounts")).data.data.accounts,
  createAccount: async (input: CashAccountCreateInput): Promise<CashAccount> =>
    (await bffApi.post("/finance/accounts", input)).data.data.account,
  updateAccount: async (id: string, input: CashAccountUpdateInput): Promise<CashAccount> =>
    (await bffApi.patch(`/finance/accounts/${id}`, input)).data.data.account,

  listTransactions: async (params: FinanceTransactionListParams): Promise<PaginatedResult<FinanceTransaction>> => {
    const response = await bffApi.get("/finance/transactions", { params: buildListParams(params) });
    const raw = response.data.data;
    return { data: raw.transactions, pagination: raw.pagination };
  },
  createTransaction: async (input: FinanceTransactionCreateInput): Promise<FinanceTransaction> =>
    (await bffApi.post("/finance/transactions", input)).data.data.transaction,
  createTransfer: async (input: FinanceTransferInput): Promise<FinanceTransaction[]> =>
    (await bffApi.post("/finance/transfers", input)).data.data.transactions,
  reverseTransaction: async (id: string, input: FinanceReverseInput): Promise<FinanceTransaction[]> =>
    (await bffApi.post(`/finance/transactions/${id}/reverse`, input)).data.data.transactions,

  getSummary: async (year: number, month: number): Promise<FinanceSummary> =>
    (await bffApi.get("/finance/summary", { params: { year, month } })).data.data,

  listPeriods: async (year: number): Promise<FinancePeriod[]> =>
    (await bffApi.get("/finance/periods", { params: { year } })).data.data.periods,
  closePeriod: async (year: number, month: number): Promise<FinancePeriod> =>
    (await bffApi.post(`/finance/periods/${year}/${month}/close`)).data.data.period,
  reopenPeriod: async (year: number, month: number, reason: string): Promise<FinancePeriod> =>
    (await bffApi.post(`/finance/periods/${year}/${month}/reopen`, { reason })).data.data.period,
};
