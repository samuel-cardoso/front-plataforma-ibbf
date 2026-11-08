"use client";

import { ArrowLeftRight, ChevronDown, Receipt, Search } from "lucide-react";
import {
  useState,
  useEffect,
  useTranslations,
  useDebounce,
  usePagination,
  useFinanceMe,
  useFunds,
  useFinanceTransactions,
} from "@/hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EmptyState, DataLoadErrorState, Pagination, TableSkeleton } from "@/components/shared";
import { FINANCE_TRANSACTIONS_PAGE_SIZE } from "@/lib/consts/finance";
import type { FinanceTransactionKind } from "@/lib/types/financeApiTypes";
import type { FinanceTransactionFormData } from "@/lib/zod/schemas/financeFormSchemas";
import { MonthSwitcher, currentYearMonth, monthBounds } from "./MonthSwitcher";
import { TransactionsTable } from "./TransactionsTable";
import { TransactionFormDialog } from "./TransactionFormDialog";
import { TransferFormDialog } from "./TransferFormDialog";

const ALL = "all";

export function TransactionsPageContent() {
  const t = useTranslations("financeiro");
  const tComum = useTranslations("comum");
  const { canWrite } = useFinanceMe();
  const { funds } = useFunds();
  const { page, limit, setPage, reset } = usePagination(FINANCE_TRANSACTIONS_PAGE_SIZE);

  const [period, setPeriod] = useState(currentYearMonth);
  const [fundId, setFundId] = useState(ALL);
  const [kind, setKind] = useState(ALL);
  const [searchText, setSearchText] = useState("");
  const debouncedSearch = useDebounce(searchText, 400);
  // O tipo fica guardado depois de fechar, para o título não trocar durante a animação de saída.
  const [newKind, setNewKind] = useState<FinanceTransactionFormData["kind"]>("INCOME");
  const [isNewOpen, setIsNewOpen] = useState(false);
  const openNew = (value: FinanceTransactionFormData["kind"]) => {
    setNewKind(value);
    setIsNewOpen(true);
  };
  const [isTransferOpen, setIsTransferOpen] = useState(false);

  useEffect(() => {
    reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [period, fundId, kind, debouncedSearch]);

  const { transactions, pagination, isLoading, isError, refetch } = useFinanceTransactions({
    page,
    limit,
    ...monthBounds(period.year, period.month),
    fundId: fundId === ALL ? undefined : fundId,
    kind: kind === ALL ? undefined : (kind as FinanceTransactionKind),
    search: debouncedSearch || undefined,
  });

  const fundItems = [{ value: ALL, label: t("todosFundos") }, ...funds.map((fund) => ({ value: fund.id, label: fund.name }))];
  const kindItems = [
    { value: ALL, label: t("todosTipos") },
    ...(["INCOME", "EXPENSE", "TRANSFER", "OPENING_BALANCE"] as const).map((value) => ({ value, label: t(`kind${value}`) })),
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <MonthSwitcher year={period.year} month={period.month} onChange={setPeriod} />
          <FilterSelect value={fundId} onChange={setFundId} items={fundItems} />
          <FilterSelect value={kind} onChange={setKind} items={kindItems} />
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="w-48 pl-9"
              placeholder={t("buscarLancamento")}
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
            />
          </div>
        </div>
        {canWrite && (
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setIsTransferOpen(true)}>
              <ArrowLeftRight /> {t("transferir")}
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button>
                    {t("novoLancamento")} <ChevronDown />
                  </Button>
                }
              />
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => openNew("INCOME")}>{t("novoINCOME")}</DropdownMenuItem>
                <DropdownMenuItem onClick={() => openNew("EXPENSE")}>{t("novoEXPENSE")}</DropdownMenuItem>
                <DropdownMenuItem onClick={() => openNew("OPENING_BALANCE")}>{t("novoOPENING_BALANCE")}</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>

      {isLoading && <TableSkeleton columns={5} />}
      {!isLoading && isError && <DataLoadErrorState onRetry={refetch} />}
      {!isLoading && !isError && transactions.length === 0 && (
        <EmptyState icon={Receipt} message={tComum("semResultados")} />
      )}
      {!isLoading && !isError && transactions.length > 0 && <TransactionsTable transactions={transactions} />}

      {pagination && <Pagination pagination={pagination} onPageChange={setPage} />}

      <TransactionFormDialog kind={newKind} open={isNewOpen} onOpenChange={setIsNewOpen} />
      <TransferFormDialog open={isTransferOpen} onOpenChange={setIsTransferOpen} />
    </div>
  );
}

type FilterSelectProps = { value: string; onChange: (value: string) => void; items: { value: string; label: string }[] };

function FilterSelect({ value, onChange, items }: FilterSelectProps) {
  return (
    <Select value={value} onValueChange={(next) => onChange((next as string) ?? ALL)} items={items}>
      <SelectTrigger className="w-44">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {items.map((item) => (
          <SelectItem key={item.value} value={item.value}>
            {item.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
