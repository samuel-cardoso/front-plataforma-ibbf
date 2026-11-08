import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { endpoints } from "@/infra/api/endpoints";
import type {
  CashAccountUpdateInput,
  FinanceCategoryType,
  FinanceCategoryUpdateInput,
  FinanceReverseInput,
  FinanceRoleAssignInput,
  FinanceTransactionListParams,
  FundUpdateInput,
} from "@/lib/types/financeApiTypes";

export const financeKeys = {
  all: ["finance"] as const,
  me: () => [...financeKeys.all, "me"] as const,
  users: () => [...financeKeys.all, "users"] as const,
  funds: () => [...financeKeys.all, "funds"] as const,
  categories: (type?: FinanceCategoryType) => [...financeKeys.all, "categories", type ?? "all"] as const,
  accounts: () => [...financeKeys.all, "accounts"] as const,
  /** Tudo que muda quando um lançamento entra/sai: livro-caixa, saldos e resumo. */
  ledger: () => [...financeKeys.all, "ledger"] as const,
  transactions: (params: FinanceTransactionListParams) => [...financeKeys.ledger(), "transactions", params] as const,
  summary: (year: number, month: number) => [...financeKeys.ledger(), "summary", year, month] as const,
  periods: (year: number) => [...financeKeys.ledger(), "periods", year] as const,
};

/** Papel financeiro do usuário logado. `isLoading` deve bloquear a renderização do módulo. */
export function useFinanceMe() {
  const query = useQuery({ queryKey: financeKeys.me(), queryFn: endpoints.getFinanceMe, staleTime: 60_000 });
  const role = query.data?.financeRole?.role ?? null;

  return {
    financeRole: query.data?.financeRole ?? null,
    canManageRoles: query.data?.canManageRoles ?? false,
    canRead: role === "TREASURER" || role === "FISCAL_COUNCIL" || role === "PASTOR_VIEWER",
    canWrite: role === "TREASURER",
    isLoading: query.isLoading,
  };
}

export function useFinanceUsers(enabled = true) {
  const query = useQuery({ queryKey: financeKeys.users(), queryFn: endpoints.listFinanceUsers, enabled });
  return { users: query.data ?? [], isLoading: query.isLoading, isError: query.isError, refetch: query.refetch };
}

export function useAssignFinanceRole() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: FinanceRoleAssignInput }) =>
      endpoints.assignFinanceRole(userId, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: financeKeys.all }),
  });
  return { assignRole: mutation.mutateAsync, isAssigning: mutation.isPending };
}

export function useRevokeFinanceRole() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: endpoints.revokeFinanceRole,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: financeKeys.all }),
  });
  return { revokeRole: mutation.mutateAsync, isRevoking: mutation.isPending };
}

export function useFunds(enabled = true) {
  const query = useQuery({ queryKey: financeKeys.funds(), queryFn: endpoints.listFunds, enabled });
  return { funds: query.data ?? [], isLoading: query.isLoading, isError: query.isError, refetch: query.refetch };
}

export function useFinanceCategories(type?: FinanceCategoryType, enabled = true) {
  const query = useQuery({
    queryKey: financeKeys.categories(type),
    queryFn: () => endpoints.listFinanceCategories(type),
    enabled,
  });
  return { categories: query.data ?? [], isLoading: query.isLoading, isError: query.isError, refetch: query.refetch };
}

export function useCashAccounts(enabled = true) {
  const query = useQuery({ queryKey: financeKeys.accounts(), queryFn: endpoints.listCashAccounts, enabled });
  return { accounts: query.data ?? [], isLoading: query.isLoading, isError: query.isError, refetch: query.refetch };
}

function useSettingsMutation<TArgs, TResult>(mutationFn: (args: TArgs) => Promise<TResult>) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn,
    // Nome/status de fundo, conta ou categoria aparecem no livro-caixa e no resumo.
    onSuccess: () => queryClient.invalidateQueries({ queryKey: financeKeys.all }),
  });
}

export function useSaveFund() {
  const create = useSettingsMutation(endpoints.createFund);
  const update = useSettingsMutation(({ id, data }: { id: string; data: FundUpdateInput }) => endpoints.updateFund(id, data));
  return { createFund: create.mutateAsync, updateFund: update.mutateAsync, isSaving: create.isPending || update.isPending };
}

export function useSaveFinanceCategory() {
  const create = useSettingsMutation(endpoints.createFinanceCategory);
  const update = useSettingsMutation(({ id, data }: { id: string; data: FinanceCategoryUpdateInput }) =>
    endpoints.updateFinanceCategory(id, data)
  );
  return { createCategory: create.mutateAsync, updateCategory: update.mutateAsync, isSaving: create.isPending || update.isPending };
}

export function useSaveCashAccount() {
  const create = useSettingsMutation(endpoints.createCashAccount);
  const update = useSettingsMutation(({ id, data }: { id: string; data: CashAccountUpdateInput }) =>
    endpoints.updateCashAccount(id, data)
  );
  return { createAccount: create.mutateAsync, updateAccount: update.mutateAsync, isSaving: create.isPending || update.isPending };
}

export function useFinanceTransactions(params: FinanceTransactionListParams, enabled = true) {
  const query = useQuery({
    queryKey: financeKeys.transactions(params),
    queryFn: () => endpoints.listFinanceTransactions(params),
    enabled,
  });
  return {
    transactions: query.data?.data ?? [],
    pagination: query.data?.pagination,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  };
}

function useLedgerMutation<TArgs, TResult>(mutationFn: (args: TArgs) => Promise<TResult>) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: financeKeys.ledger() }),
  });
}

export function useCreateFinanceTransaction() {
  const mutation = useLedgerMutation(endpoints.createFinanceTransaction);
  return { createTransaction: mutation.mutateAsync, isCreating: mutation.isPending };
}

export function useCreateFinanceTransfer() {
  const mutation = useLedgerMutation(endpoints.createFinanceTransfer);
  return { createTransfer: mutation.mutateAsync, isCreating: mutation.isPending };
}

export function useReverseFinanceTransaction() {
  const mutation = useLedgerMutation(({ id, data }: { id: string; data: FinanceReverseInput }) =>
    endpoints.reverseFinanceTransaction(id, data)
  );
  return { reverseTransaction: mutation.mutateAsync, isReversing: mutation.isPending };
}

export function useFinanceSummary(year: number, month: number, enabled = true) {
  const query = useQuery({
    queryKey: financeKeys.summary(year, month),
    queryFn: () => endpoints.getFinanceSummary(year, month),
    enabled,
  });
  return { summary: query.data, isLoading: query.isLoading, isError: query.isError, refetch: query.refetch };
}

export function useFinancePeriods(year: number, enabled = true) {
  const query = useQuery({
    queryKey: financeKeys.periods(year),
    queryFn: () => endpoints.listFinancePeriods(year),
    enabled,
  });
  return { periods: query.data ?? [], isLoading: query.isLoading, isError: query.isError, refetch: query.refetch };
}

export function useCloseFinancePeriod() {
  const mutation = useLedgerMutation(({ year, month }: { year: number; month: number }) =>
    endpoints.closeFinancePeriod(year, month)
  );
  return { closePeriod: mutation.mutateAsync, isClosing: mutation.isPending };
}

export function useReopenFinancePeriod() {
  const mutation = useLedgerMutation(({ year, month, reason }: { year: number; month: number; reason: string }) =>
    endpoints.reopenFinancePeriod(year, month, reason)
  );
  return { reopenPeriod: mutation.mutateAsync, isReopening: mutation.isPending };
}
