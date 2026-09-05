"use client";

import Link from "next/link";
import { useState, useTranslations, useMinistry, useMinistryMembers, usePagination, usePermissions } from "@/hooks";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState, DataLoadErrorState, Pagination } from "@/components/shared";
import { MinistryMembersTable } from "./MinistryMembersTable";
import { MinistryMemberAddForm } from "./MinistryMemberAddForm";
import { MINISTRY_PAGE_SIZE } from "@/lib/consts/ministry";
import { paths } from "@/lib/utils/paths";
import { ChevronLeft, Plus } from "lucide-react";

type MinistryMembersPageContentProps = { ministryId: string };

export function MinistryMembersPageContent({ ministryId }: MinistryMembersPageContentProps) {
  const t = useTranslations("ministerios");
  const tComum = useTranslations("comum");
  const { canManage } = usePermissions();
  const { ministry } = useMinistry(ministryId);
  const { page, limit, setPage } = usePagination(MINISTRY_PAGE_SIZE);
  const { participations, pagination, isLoading, isError, refetch } = useMinistryMembers(
    ministryId,
    { page, limit }
  );
  const [isAddOpen, setIsAddOpen] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="w-fit -ml-2"
            nativeButton={false}
            render={
              <Link href={paths.ministries.list}>
                <ChevronLeft /> {tComum("voltar")}
              </Link>
            }
          />
          <h1 className="text-xl font-semibold">
            {ministry?.name ?? t("participantes")} — {t("participantes")}
          </h1>
        </div>
        {canManage && (
          <Button onClick={() => setIsAddOpen(true)}>
            <Plus /> {t("adicionarParticipante")}
          </Button>
        )}
      </div>

      {isLoading && <Skeleton className="h-64 w-full" />}
      {!isLoading && isError && <DataLoadErrorState onRetry={refetch} />}
      {!isLoading && !isError && participations.length === 0 && (
        <EmptyState message={tComum("semResultados")} />
      )}
      {!isLoading && !isError && participations.length > 0 && (
        <MinistryMembersTable ministryId={ministryId} participations={participations} />
      )}

      {pagination && <Pagination pagination={pagination} onPageChange={setPage} />}

      <MinistryMemberAddForm ministryId={ministryId} open={isAddOpen} onOpenChange={setIsAddOpen} />
    </div>
  );
}
