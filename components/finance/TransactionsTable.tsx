"use client";

import { toast } from "sonner";
import { MoreHorizontal, Undo2, UserRound } from "lucide-react";
import { useState, useLocale, useTranslations, useFinanceMe, useReverseFinanceTransaction } from "@/hooks";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { getAxiosErrorMessage } from "@/lib/utils/api/getAxiosErrorMessage";
import { formatLocalizedDate } from "@/lib/utils/format/date";
import { formatCents } from "@/lib/utils/format/money";
import type { FinanceTransaction } from "@/lib/types/financeApiTypes";
import { ReasonDialog } from "./ReasonDialog";

/** `yyyy-MM-dd` → data local (evita o deslocamento de fuso de `new Date("2026-11-08")`, que é UTC). */
function parseIsoDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function TransactionsTable({ transactions }: { transactions: FinanceTransaction[] }) {
  const t = useTranslations("financeiro");
  const tComum = useTranslations("comum");
  const locale = useLocale();
  const { canWrite } = useFinanceMe();
  const { reverseTransaction, isReversing } = useReverseFinanceTransaction();
  const [reversingId, setReversingId] = useState<string | null>(null);

  const handleReverse = async (reason: string) => {
    if (!reversingId) return;
    try {
      await reverseTransaction({ id: reversingId, data: { reason } });
      toast.success(t("estornoRegistrado"));
      setReversingId(null);
    } catch (error) {
      toast.error(getAxiosErrorMessage(error));
    }
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("data")}</TableHead>
            <TableHead>{t("descricao")}</TableHead>
            <TableHead>{t("fundo")}</TableHead>
            <TableHead>{t("conta")}</TableHead>
            <TableHead className="text-right">{t("valor")}</TableHead>
            {canWrite && <TableHead className="w-10">{tComum("acoes")}</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => {
            const isReversal = !!transaction.reversesId;
            const isReversed = !!transaction.reversedById;
            const title =
              transaction.categoryName ??
              (transaction.kind === "TRANSFER" ? t("kindTRANSFER") : t(`kind${transaction.kind}`));

            return (
              <TableRow key={transaction.id} className={cn(isReversed && "text-muted-foreground")}>
                <TableCell className="whitespace-nowrap">
                  {formatLocalizedDate(parseIsoDate(transaction.date), locale)}
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-0.5">
                    <span className={cn("flex items-center gap-2 font-medium", isReversed && "line-through")}>
                      {title}
                      {transaction.hasMember && (
                        <Tooltip>
                          <TooltipTrigger render={<UserRound className="size-3.5 text-muted-foreground" />} />
                          <TooltipContent>{transaction.memberName ?? t("contribuicaoIdentificada")}</TooltipContent>
                        </Tooltip>
                      )}
                      {isReversal && <Badge variant="outline">{t("estorno")}</Badge>}
                      {isReversed && <Badge variant="secondary">{t("estornado")}</Badge>}
                    </span>
                    {(transaction.description || transaction.method) && (
                      <span className="text-xs text-muted-foreground">
                        {[transaction.method && t(`metodo${transaction.method}`), transaction.description]
                          .filter(Boolean)
                          .join(" · ")}
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell>{transaction.fundName}</TableCell>
                <TableCell>{transaction.cashAccountName}</TableCell>
                <TableCell
                  className={cn(
                    "text-right font-medium whitespace-nowrap tabular-nums",
                    !isReversed && transaction.amountCents > 0 && "text-emerald-600 dark:text-emerald-400",
                    !isReversed && transaction.amountCents < 0 && "text-destructive"
                  )}
                >
                  {formatCents(transaction.amountCents, locale)}
                </TableCell>
                {canWrite && (
                  <TableCell>
                    {!isReversal && !isReversed && (
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          render={
                            <Button variant="ghost" size="icon-sm" aria-label={tComum("acoes")}>
                              <MoreHorizontal />
                            </Button>
                          }
                        />
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem variant="destructive" onClick={() => setReversingId(transaction.id)}>
                            <Undo2 /> {t("estornar")}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </TableCell>
                )}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <ReasonDialog
        open={!!reversingId}
        onOpenChange={(open) => !open && setReversingId(null)}
        title={t("estornarTitulo")}
        description={t("estornarDescricao")}
        onConfirm={handleReverse}
        isSubmitting={isReversing}
      />
    </>
  );
}
