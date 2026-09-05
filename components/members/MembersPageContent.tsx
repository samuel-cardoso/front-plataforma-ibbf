"use client";

import Link from "next/link";
import { useMemo, useState, useTranslations, useMembers, useFamilies, usePagination, usePermissions } from "@/hooks";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState, DataLoadErrorState, Pagination } from "@/components/shared";
import { MembersFilters, type MembersFiltersState } from "./MembersFilters";
import { MembersTable } from "./MembersTable";
import { EMPTY_MEMBER_FILTERS, MEMBER_PAGE_SIZE } from "@/lib/consts/member";
import { paths } from "@/lib/utils/paths";
import { Plus } from "lucide-react";

export function MembersPageContent() {
  const t = useTranslations("membros");
  const tComum = useTranslations("comum");
  const { canManage } = usePermissions();
  const { page, limit, setPage, reset } = usePagination(MEMBER_PAGE_SIZE);
  const [filters, setFilters] = useState<MembersFiltersState>(EMPTY_MEMBER_FILTERS);

  const { members, pagination, isLoading, isError, refetch } = useMembers({
    page,
    limit,
    search: filters.search || undefined,
    memberType: (filters.memberType || undefined) as never,
    memberStatus: (filters.memberStatus || undefined) as never,
    familyId: filters.familyId || undefined,
  });

  const { families } = useFamilies({ limit: 100 });
  const familyNameById = useMemo(
    () => Object.fromEntries(families.map((family) => [family.id, family.name])),
    [families]
  );

  const handleFiltersChange = (next: MembersFiltersState) => {
    setFilters(next);
    reset();
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">{t("titulo")}</h1>
        {canManage && (
          <Button
            nativeButton={false}
            render={
              <Link href={paths.members.new}>
                <Plus /> {t("novoMembro")}
              </Link>
            }
          />
        )}
      </div>

      <MembersFilters filters={filters} onChange={handleFiltersChange} />

      {isLoading && <Skeleton className="h-64 w-full" />}
      {!isLoading && isError && <DataLoadErrorState onRetry={refetch} />}
      {!isLoading && !isError && members.length === 0 && <EmptyState message={tComum("semResultados")} />}
      {!isLoading && !isError && members.length > 0 && (
        <MembersTable members={members} familyNameById={familyNameById} />
      )}

      {pagination && <Pagination pagination={pagination} onPageChange={setPage} />}
    </div>
  );
}
