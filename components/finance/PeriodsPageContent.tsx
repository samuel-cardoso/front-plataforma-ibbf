"use client";

import { toast } from "sonner";
import { ChevronLeftIcon, ChevronRightIcon, LockIcon, LockOpenIcon } from "lucide-react";
import {
  useState,
  useLocale,
  useTranslations,
  useFinanceMe,
  useFinancePeriods,
  useCloseFinancePeriod,
  useReopenFinancePeriod,
} from "@/hooks";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ConfirmDeleteDialog } from "@/components/shared/confirm-dialog";
import { DataLoadErrorState, TableSkeleton } from "@/components/shared";
import { getAxiosErrorMessage } from "@/lib/utils/api/getAxiosErrorMessage";
import type { FinancePeriod } from "@/lib/types/financeApiTypes";
import { ReasonDialog } from "./ReasonDialog";

export function PeriodsPageContent() {
  const t = useTranslations("financeiro");
  const locale = useLocale();
  const { canWrite, canManageRoles } = useFinanceMe();
  const [year, setYear] = useState(() => new Date().getFullYear());
  const { periods, isLoading, isError, refetch } = useFinancePeriods(year);
  const { closePeriod, isClosing } = useCloseFinancePeriod();
  const { reopenPeriod, isReopening } = useReopenFinancePeriod();
  const [closing, setClosing] = useState<FinancePeriod | null>(null);
  const [reopening, setReopening] = useState<FinancePeriod | null>(null);

  const now = new Date();
  const isFuture = (period: FinancePeriod) =>
    period.year > now.getFullYear() || (period.year === now.getFullYear() && period.month > now.getMonth() + 1);
  const monthLabel = (period: FinancePeriod) =>
    new Intl.DateTimeFormat(locale, { month: "long" }).format(new Date(period.year, period.month - 1, 1));

  const handleClose = async () => {
    if (!closing) return;
    try {
      await closePeriod({ year: closing.year, month: closing.month });
      toast.success(t("mesFechadoSucesso"));
      setClosing(null);
    } catch (error) {
      toast.error(getAxiosErrorMessage(error));
    }
  };

  const handleReopen = async (reason: string) => {
    if (!reopening) return;
    try {
      await reopenPeriod({ year: reopening.year, month: reopening.month, reason });
      toast.success(t("mesReabertoSucesso"));
      setReopening(null);
    } catch (error) {
      toast.error(getAxiosErrorMessage(error));
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("fechamentoTitulo")}</CardTitle>
        <CardDescription>{t("fechamentoDescricao")}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex items-center gap-1">
          <Button variant="outline" size="icon-sm" onClick={() => setYear(year - 1)} aria-label={t("anoAnterior")}>
            <ChevronLeftIcon />
          </Button>
          <span className="min-w-16 text-center text-sm font-medium">{year}</span>
          <Button variant="outline" size="icon-sm" onClick={() => setYear(year + 1)} aria-label={t("proximoAno")}>
            <ChevronRightIcon />
          </Button>
        </div>

        {isLoading && <TableSkeleton columns={3} />}
        {!isLoading && isError && <DataLoadErrorState onRetry={refetch} />}
        {!isLoading && !isError && (
          <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {periods.map((period) => {
              const closed = period.status === "CLOSED";
              return (
                <li key={period.month} className="flex items-center justify-between gap-2 rounded-lg border px-3 py-2">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium capitalize">{monthLabel(period)}</span>
                    <Badge variant={closed ? "secondary" : "outline"} className="mt-1 w-fit">
                      {closed ? <LockIcon /> : <LockOpenIcon />}
                      {closed ? t("mesFechado") : t("mesAberto")}
                    </Badge>
                  </div>
                  {!closed && canWrite && !isFuture(period) && (
                    <Button variant="outline" size="sm" onClick={() => setClosing(period)}>
                      {t("fecharMes")}
                    </Button>
                  )}
                  {closed && canManageRoles && (
                    <Button variant="ghost" size="sm" onClick={() => setReopening(period)}>
                      {t("reabrirMes")}
                    </Button>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>

      <ConfirmDeleteDialog
        open={!!closing}
        onOpenChange={(open) => !open && setClosing(null)}
        onConfirm={handleClose}
        isDeleting={isClosing}
        title={closing ? t("fecharMesTitulo", { mes: monthLabel(closing), ano: closing.year }) : ""}
        description={t("fecharMesDescricao")}
        confirmLabel={t("fecharMes")}
        pendingLabel={t("fechando")}
        variant="default"
      />
      <ReasonDialog
        open={!!reopening}
        onOpenChange={(open) => !open && setReopening(null)}
        title={reopening ? t("reabrirMesTitulo", { mes: monthLabel(reopening), ano: reopening.year }) : ""}
        description={t("reabrirMesDescricao")}
        onConfirm={handleReopen}
        isSubmitting={isReopening}
      />
    </Card>
  );
}
