"use client";

import Link from "next/link";
import { useState, useEffect, useTranslations, useFamilies, useDebounce, usePagination, usePermissions } from "@/hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, House } from "lucide-react";
import { EmptyState, DataLoadErrorState, Pagination, TableSkeleton } from "@/components/shared";
import { FamiliesTable } from "./FamiliesTable";
import { FAMILY_PAGE_SIZE } from "@/lib/consts/family";
import { paths } from "@/lib/utils/paths";

export function FamiliesPageContent() {
  const t = useTranslations("familias");
  const tComum = useTranslations("comum");
  const { canManage } = usePermissions();
  const { page, limit, setPage, reset } = usePagination(FAMILY_PAGE_SIZE);

  const [searchText, setSearchText] = useState("");
  const debouncedSearch = useDebounce(searchText, 400);

  useEffect(() => {
    reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  const { families, pagination, isLoading, isError, refetch } = useFamilies({
    page,
    limit,
    search: debouncedSearch || undefined,
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="w-56 pl-9"
            placeholder={t("buscarPlaceholder")}
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
          />
        </div>
        {canManage && (
          <Button
            nativeButton={false}
            render={
              <Link href={paths.families.new}>
                {t("novaFamilia")}
              </Link>
            }
          />
        )}
      </div>

      {isLoading && <TableSkeleton columns={canManage ? 3 : 2} />}
      {!isLoading && isError && <DataLoadErrorState onRetry={refetch} />}
      {!isLoading && !isError && families.length === 0 && (
        <EmptyState icon={House} message={tComum("semResultados")} />
      )}
      {!isLoading && !isError && families.length > 0 && <FamiliesTable families={families} />}

      {pagination && <Pagination pagination={pagination} onPageChange={setPage} />}
    </div>
  );
}
